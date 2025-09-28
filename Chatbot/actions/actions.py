from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests


# --------- Gợi ý sản phẩm / khuyến mãi ----------
class ActionSuggestProducts(Action):
    def name(self) -> Text:
        return "action_suggest_products"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        # Các thuộc tính lọc sản phẩm
        filter_fields = [
            "brandName",
            "categoryName",
            "materialName",
            "collarName",
            "sleeveName",
            "colorName",
            "sizeName",
        ]

        params = {k: "" for k in filter_fields}
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
        except Exception as e:
            dispatcher.utter_message(
                text=f"❌ Xin lỗi, hiện tại hệ thống không lấy được danh sách sản phẩm. Lý do: {str(e)}"
            )
            return []

        if not products:
            dispatcher.utter_message(
                text="😢 Mình chưa tìm thấy sản phẩm phù hợp. Bạn có thể thử chọn thêm màu sắc, size, chất liệu hoặc thương hiệu khác nhé!"
            )
            return []

        # Format kết quả
        msg = "✨ Đây là một vài gợi ý từ **Mộc Wear** cho bạn:\n\n"
        for i, p in enumerate(products, 1):
            name = p.get("nameProduct", "Sản phẩm")
            code = p.get("codeProduct", "")
            price = p.get("salePrice", 0)
            promo = p.get("promotionPercent", 0)
            sold = p.get("quantitySaled", 0)

            if promo and promo > 0:
                final_price = int(price * (100 - promo) / 100)
                price_text = f"💰 Giá: **{final_price:,}đ**  (~~{price:,}đ~~ *-{promo}%*)"
            else:
                price_text = f"💰 Giá: **{price:,}đ**"

            msg += (
                f"{i}. 🧾 **[{name}](http://localhost:5173/view-product/{code})**\n"
                f"{price_text}\n"
                f"📦 Đã bán: {sold}\n\n"
            )

        msg += "👉 Bạn có muốn mình lọc thêm theo màu sắc, chất liệu hoặc khoảng giá không?"
        dispatcher.utter_message(text=msg)
        return []


# --------- Tư vấn size theo chiều cao / cân nặng ----------
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
            """Chuẩn hoá số đo thành integer cm/kg."""
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

        # Bảng size chuẩn (tham khảo)
        size_guide = [
            {"size": "S",  "height": (160, 166), "weight": (50, 60)},
            {"size": "M",  "height": (167, 172), "weight": (61, 67)},
            {"size": "L",  "height": (173, 178), "weight": (68, 74)},
            {"size": "XL", "height": (179, 185), "weight": (75, 85)},
            {"size": "2XL","height": (186, 195), "weight": (86, 100)},
        ]

        # ===== 1. Có cả chiều cao và cân nặng =====
        if h and w:
            for g in size_guide:
                if g["height"][0] <= h <= g["height"][1] and g["weight"][0] <= w <= g["weight"][1]:
                    dispatcher.utter_message(
                        text=f"👉 Với chiều cao **{h}cm** và cân nặng **{w}kg**, size phù hợp nhất là **{g['size']}** 👍"
                    )
                    return []
            # Ngoài bảng → gợi ý gần nhất
            if h > 195 or w > 100:
                dispatcher.utter_message(
                    text=f"⚠️ Với số đo **{h}cm/{w}kg**, bạn nên thử **2XL hoặc lớn hơn**. "
                         "Để chắc chắn, bạn có thể thử trực tiếp tại cửa hàng nhé!"
                )
            elif h < 160 or w < 50:
                dispatcher.utter_message(
                    text=f"🤔 Với số đo **{h}cm/{w}kg**, size **S** có thể vừa. "
                         "Nếu thích thoải mái hơn thì có thể thử **M**."
                )
            else:
                dispatcher.utter_message(
                    text=f"👉 Với **{h}cm/{w}kg**, size tham khảo là **L hoặc XL**, "
                         "tùy vào dáng người và sở thích mặc ôm hay rộng."
                )

        # ===== 2. Chỉ có chiều cao =====
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
                     "Nếu bạn cho mình thêm cân nặng thì mình sẽ tư vấn chính xác hơn 👍"
            )

        # ===== 3. Chỉ có cân nặng =====
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
                     "Nếu bạn cho mình thêm chiều cao thì sẽ chuẩn hơn nữa."
            )

        # ===== 4. Không có gì =====
        else:
            dispatcher.utter_message(
                text="📏 Bạn vui lòng cho mình biết **chiều cao (cm)** và/hoặc **cân nặng (kg)** để mình tư vấn size phù hợp nhé."
            )

        return []
