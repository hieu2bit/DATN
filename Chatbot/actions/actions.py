from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import EventType, SessionStarted, ActionExecuted
import requests
import random


# --------- Gợi ý sản phẩm ----------
class ActionSuggestProducts(Action):
    def name(self) -> Text:
        return "action_suggest_products"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Các thuộc tính filter (reset mỗi lần gọi)
        filter_fields = [
            "brandName",
            "categoryName",
            "materialName",
            "collarName",
            "sleeveName",
            "colorName",
            "sizeName",
        ]

        # Reset tất cả về rỗng
        params = {k: "" for k in filter_fields}

        # Chỉ lấy entity từ câu hỏi hiện tại
        for ent in tracker.latest_message.get("entities", []):
            et = ent.get("entity")
            if et in params:
                params[et] = ent.get("value", "")

        # Phân trang mặc định
        params.update({"page": 0, "size": 5})

        try:
            resp = requests.get(
                "http://localhost:8080/api/products/filter-by-attributes",
                params=params,
                timeout=7,
            )
            resp.raise_for_status()
            products = resp.json().get("content", [])
        except Exception:
            dispatcher.utter_message(
                text="❌ Xin lỗi, hiện tại hệ thống đang gặp sự cố nên chưa thể hiển thị sản phẩm. "
                     "Bạn vui lòng thử lại sau ít phút nhé."
            )
            return []

        if not products:
            dispatcher.utter_message(
                text="😔 Mình chưa tìm thấy sản phẩm phù hợp. "
                     "Bạn muốn mình gợi ý thêm theo màu sắc, thương hiệu hay size không?"
            )
            return []

        # Gợi ý sản phẩm
        msg = random.choice([
            "✨ Đây là một vài gợi ý từ **MộcWear** dành cho bạn:",
            "💡 Mình tìm được những sản phẩm phù hợp, bạn tham khảo nhé:",
            "📌 Dưới đây là các sản phẩm nổi bật theo yêu cầu của bạn:"
        ]) + "\n\n"

        for i, p in enumerate(products, 1):
            name = p.get("nameProduct", "Sản phẩm")
            code = p.get("codeProduct", "")
            price = int (p.get("salePrice", 0))
            promo = p.get("promotionPercent", 0)
            sold = p.get("quantitySaled", 0)

            # Nếu có khuyến mãi
            if promo and promo > 0:
                final_price = int(price * (100 - promo) / 100)
                price_text = f"💰 Giá: **{final_price:,}đ**  (~~{price:,}đ~~ *-{promo}%*)"
            else:
                price_text = f"💰 Giá: **{price:,}đ**"

            # Format 1 sản phẩm
            msg += (
                f"**[{name}](http://localhost:5173/view-product/{code})**  \n"
                f"{price_text}  \n"
                f"📦 Đã bán: {sold} \n\n"
            )

        msg += random.choice([
            "👉 Bạn có muốn mình lọc thêm theo **màu sắc**, **chất liệu** hoặc **khoảng giá** không?",
            "🛒 Bạn có muốn tham khảo thêm nhiều sản phẩm khác không?",
            "💡 Nếu muốn, bạn có thể cho mình thêm thông tin để lọc sản phẩm chính xác hơn."
        ])

        dispatcher.utter_message(text=msg.strip())
        return []


# --------- Tư vấn size ----------
class ActionSuggestSize(Action):
    def name(self) -> Text:
        return "action_suggest_size"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        height_val = next(tracker.get_latest_entity_values("height"), None)
        weight_val = next(tracker.get_latest_entity_values("weight"), None)

        def normalize(value: Text, unit: str) -> int | None:
            if not value:
                return None
            s = str(value).lower().replace("cm", "").replace("kg", "").replace("m", "")
            s = s.replace(".", "").strip()
            try:
                n = int(s)
                if unit == "height" and 100 <= n <= 220:
                    return n
                if unit == "weight" and 30 <= n <= 150:
                    return n
            except ValueError:
                return None
            return None

        h = normalize(height_val, "height")
        w = normalize(weight_val, "weight")

        # Bảng size tham khảo
        size_guide = [
            {"size": "S",  "height": (160, 166), "weight": (50, 60)},
            {"size": "M",  "height": (167, 172), "weight": (61, 67)},
            {"size": "L",  "height": (173, 178), "weight": (68, 74)},
            {"size": "XL", "height": (179, 185), "weight": (75, 85)},
            {"size": "2XL","height": (186, 195), "weight": (86, 100)},
        ]

        # 1. Có cả chiều cao và cân nặng
        if h and w:
            for g in size_guide:
                if g["height"][0] <= h <= g["height"][1] and g["weight"][0] <= w <= g["weight"][1]:
                    dispatcher.utter_message(
                        text=random.choice([
                            f"📏 Với chiều cao **{h}cm** và cân nặng **{w}kg**, size phù hợp nhất là **{g['size']}** 👍",
                            f"👉 Số đo **{h}cm/{w}kg** → size gợi ý: **{g['size']}**.",
                            f"👌 Với thông số của bạn (**{h}cm/{w}kg**), mình khuyên chọn size **{g['size']}**."
                        ])
                    )
                    return []

            if h > 195 or w > 100:
                dispatcher.utter_message(
                    text="⚠️ Với số đo này, bạn nên chọn size **2XL hoặc lớn hơn**. "
                         "Tốt nhất bạn nên thử trực tiếp tại cửa hàng để chắc chắn hơn."
                )
            elif h < 160 or w < 50:
                dispatcher.utter_message(
                    text="🤔 Với số đo này, size **S** có thể phù hợp. "
                         "Nếu muốn thoải mái hơn, bạn có thể thử size **M**."
                )
            else:
                dispatcher.utter_message(
                    text="👉 Số đo của bạn nằm giữa các khoảng size. "
                         "Bạn có thể thử **L hoặc XL**, tùy vào dáng người và sở thích mặc ôm hay rộng."
                )

        # 2. Chỉ có chiều cao
        elif h and not w:
            if h < 165:
                size = "S hoặc M"
            elif h < 175:
                size = "M hoặc L"
            elif h < 185:
                size = "L hoặc XL"
            else:
                size = "XL hoặc 2XL"
            dispatcher.utter_message(
                text=f"📏 Với chiều cao **{h}cm**, size tham khảo là **{size}**. "
                     "Nếu bạn cho mình thêm cân nặng thì mình sẽ tư vấn chuẩn hơn."
            )

        # 3. Chỉ có cân nặng
        elif w and not h:
            if w < 55:
                size = "S"
            elif w < 65:
                size = "M"
            elif w < 75:
                size = "L"
            elif w < 85:
                size = "XL"
            else:
                size = "2XL"
            dispatcher.utter_message(
                text=f"⚖️ Với cân nặng **{w}kg**, size tham khảo là **{size}**. "
                     "Nếu có thêm chiều cao, mình sẽ tư vấn chính xác hơn nhé."
            )

        # 4. Không có thông tin
        else:
            dispatcher.utter_message(
                text="📌 Bạn vui lòng cho mình biết **chiều cao (cm)** và/hoặc **cân nặng (kg)** để mình tư vấn size phù hợp nhất nhé."
            )

        return []
class ActionSessionStart(Action):
    def name(self) -> Text:
        return "action_session_start"

    async def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[EventType]:
        events: List[EventType] = [SessionStarted()]

        # Lấy danh sách các câu trong domain
        greet_responses = domain["responses"].get("utter_greet", [])
        intro_responses = domain["responses"].get("utter_intro", [])

        # Chọn ngẫu nhiên một câu từ mỗi nhóm
        if greet_responses:
            greet_text = random.choice(greet_responses).get("text", "")
            if greet_text:
                dispatcher.utter_message(text=greet_text)

        if intro_responses:
            intro_text = random.choice(intro_responses).get("text", "")
            if intro_text:
                dispatcher.utter_message(text=intro_text)

        # Quay lại trạng thái lắng nghe
        events.append(ActionExecuted("action_listen"))
        return events
