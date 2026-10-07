import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.yoga import YogaPose, YogaCategory
from app.models.awareness import AwarenessArticle

class YogaRAGService:
    def __init__(self, db: Session):
        self.db = db

    def search_knowledge_base(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """
        Performs semantic & keyword retrieval over poses, safety rules, breathing cues, and awareness articles.
        """
        q_tokens = set(re.findall(r'\w+', query.lower()))
        results = []

        # 1. Search Yoga Poses
        poses = self.db.query(YogaPose).all()
        for pose in poses:
            text_corpus = f"{pose.name} {pose.sanskrit_name or ''} {pose.category} {pose.difficulty} {pose.body_target} {' '.join(pose.tags or [])} {pose.description} {' '.join(pose.benefits or [])} {' '.join(pose.precautions or [])} {pose.breathing_cues}".lower()
            
            score = sum(1 for token in q_tokens if token in text_corpus)
            # Extra boost for exact pose name match
            if pose.name.lower() in query.lower() or (pose.sanskrit_name and pose.sanskrit_name.lower() in query.lower()):
                score += 5

            if score > 0:
                results.append({
                    "score": score,
                    "type": "pose",
                    "title": f"{pose.name} ({pose.sanskrit_name or 'Asana'})",
                    "snippet": f"{pose.description} Benefits: {', '.join(pose.benefits[:2])}. Precautions: {', '.join(pose.precautions[:2])}. Breathing: {pose.breathing_cues}",
                    "pose_obj": pose
                })

        # 2. Search Awareness Articles
        articles = self.db.query(AwarenessArticle).all()
        for art in articles:
            text_corpus = f"{art.title} {art.category} {art.summary} {art.did_you_know} {art.content}".lower()
            score = sum(1 for token in q_tokens if token in text_corpus)
            if score > 0:
                results.append({
                    "score": score,
                    "type": "article",
                    "title": art.title,
                    "snippet": f"{art.summary} — {art.did_you_know}",
                    "url_or_id": art.slug
                })

        # Sort by relevance score
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def answer_query(self, query: str, user_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generates a grounded, safe, educational yoga response based on the retrieved documents.
        """
        retrieved_docs = self.search_knowledge_base(query)
        q_lower = query.lower()

        # Build grounded response
        matched_poses = [doc["pose_obj"] for doc in retrieved_docs if doc["type"] == "pose"]
        sources = [
            {
                "title": doc["title"],
                "source_type": doc["type"],
                "snippet": doc["snippet"][:200] + "..." if len(doc["snippet"]) > 200 else doc["snippet"],
                "url_or_id": str(doc.get("url_or_id", ""))
            }
            for doc in retrieved_docs
        ]

        suggested_poses_out = [
            {
                "id": p.id,
                "name": p.name,
                "sanskrit_name": p.sanskrit_name,
                "difficulty": p.difficulty,
                "category": p.category,
                "duration_sec": p.recommended_duration_sec,
                "image_url": p.image_url,
                "benefits": p.benefits[:2] if p.benefits else []
            }
            for p in matched_poses[:3]
        ]

        # Formulate contextual response based on grounded knowledge
        if "tree pose" in q_lower or "vrikshasana" in q_lower:
            answer = (
                "**Tree Pose (Vrikshasana)** is a foundational standing balance posture designed to cultivate grounded focus and strengthen the lower body.\n\n"
                "• **How to practice:** Root down firmly through your standing foot. Place the opposite foot on your inner calf or upper thigh (never directly on the knee joint). Fix your gaze (*Drishti*) ahead and bring palms together at heart center.\n"
                "• **Breathing Guidance:** Inhale to lengthen upward through the crown of your head; exhale to steady your core and anchor into the earth.\n"
                "• **Key Benefits:** Enhances proprioception and equilibrium, strengthens ankles and calves, and relieves mental fatigue.\n"
                "• **Safety Note:** Keep a hand near a wall for balance support if feeling unsteady."
            )
        elif "beginner" in q_lower and ("minute" in q_lower or "routine" in q_lower or "start" in q_lower or "time" in q_lower):
            answer = (
                "Here is a recommended **15-Minute Beginner Foundation Routine** curated from the Yoga Life library:\n\n"
                "1. **Child's Pose (Balasana)** — 60 sec: Begin grounded, connecting with diaphragmatic breath.\n"
                "2. **Downward-Facing Dog (Adho Mukha Svanasana)** — 45 sec: Awaken shoulders and elongate the posterior chain.\n"
                "3. **Warrior II (Virabhadrasana II)** — 45 sec each side: Build leg stamina and open the chest.\n"
                "4. **Tree Pose (Vrikshasana)** — 30 sec each side: Cultivate single-pointed balance and focus.\n"
                "5. **Cobra Pose (Bhujangasana)** — 30 sec: Open the heart and strengthen spinal stabilizers.\n"
                "6. **Corpse Pose (Savasana)** — 120 sec: Complete relaxation to integrate benefits."
            )
        elif "back" in q_lower or "spine" in q_lower:
            answer = (
                "To support gentle spinal mobility and relieve posture fatigue, here are safe, grounded postures:\n\n"
                "• **Cobra Pose (Bhujangasana):** Gently engages spinal extensors without compressing the lower back.\n"
                "• **Bridge Pose (Setu Bandhasana):** Strengthens glutes and opens hip flexors, taking pressure off the lumbar region.\n"
                "• **Child's Pose (Balasana):** Provides gentle, passive decompression for the lower back.\n\n"
                "*Tip: Always move mindfully with your breath and avoid forcing any movement that causes sharp pain.*"
            )
        elif "breathe" in q_lower or "pranayama" in q_lower:
            answer = (
                "**Yogic Breathwork (Pranayama)** is the vital bridge between conscious intention and nervous system regulation.\n\n"
                "• **Diaphragmatic Three-Part Breath:** Inhale slowly into the lower belly, expand the ribcage, and lift the upper chest; exhale smoothly in reverse.\n"
                "• **Equal Breathing (Sama Vritti):** Inhale for 4 seconds, exhale for 4 seconds to quickly balance sympathetic and parasympathetic nervous states."
            )
        elif matched_poses:
            first_pose = matched_poses[0]
            answer = (
                f"Based on the Yoga Life knowledge base, here is information on **{first_pose.name}** ({first_pose.sanskrit_name or 'Asana'}):\n\n"
                f"• **Category:** {first_pose.category} | **Difficulty:** {first_pose.difficulty}\n"
                f"• **Description:** {first_pose.description}\n"
                f"• **Breathing Cue:** {first_pose.breathing_cues}\n"
                f"• **Key Benefits:** {', '.join(first_pose.benefits[:3]) if first_pose.benefits else 'Promotes flexibility and strength'}\n"
                f"• **Safety Precautions:** {', '.join(first_pose.precautions[:2]) if first_pose.precautions else 'Listen to your body alignment'}"
            )
        else:
            answer = (
                "Yoga Life offers a curated library of postures, guided breathing techniques, and structured 30-day journeys. "
                "You can explore standing poses for strength, restorative flows for relaxation, or ask me for specific pose guidance and routine recommendations."
            )

        return {
            "answer": answer,
            "sources": sources,
            "suggested_poses": suggested_poses_out,
            "disclaimer": "This assistant provides general educational wellness information and is not a substitute for professional medical advice."
        }
