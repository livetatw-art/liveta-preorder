import { useState, useEffect, useRef, useCallback } from "react";

const LOGO_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAphUlEQVR42u2d93dkx3XnPxXeex0RBoPJgRxmmVTy8VrySvbqrNf28Z7d/Xv3WCvLshVIK1EkFUgOOeRkYJA7vVBV+0PVe909nBkGTWgA9eXBAUkAjcar+tYNde/3CuecIyIi4oGQ8RFERESCREREgkRERIJERESCREREgkRERIJERESCREREgkRERIJEREREgkRERIJERESCREREgkRERIJERESCREREgkRERIJERESCREREgkRERESCREREgkRERIJERESCREREgkRERIJERESCREREgkRERIJEREREgkRERIJERESCREREgkRERIJERESCREQcHuj4CJ4xHjYiUojma/V3iNmvRTwViDjE8+mRwH2GA+LPe81IlEiQw0YEN7N5P5cAzmHGE6o8RyqFkNL/nJQIJZls7TC+fReRJqTLfXS77T+6nZmXcN6yRLJEgiweHxzUB/lDNqgtS0xRYoqCKs/J9/YpBwNcVZFvbpMPh1hjPCnCawgpsNaSD0dopZBaIYREpylSadqn11l56Qrtk2vzvzdalUiQhSDFA9wjW5bk+wdMdncZ7+yQ7+1TDAZUozGmLLFVhTUGZ4z3tQSeFMFqMOuEhU9CSkAgpURIgRASKSVJkiKlorV2guzECq3VFTpnTyOTJBIlEmQxSGHLitHWFoPbdxhubDDZ3qEYjbBlOXWxAgGEEH7DChHcoRkuuAdEJ/XvmVuawCrnkEqjtEY4hxACJRXttTVOfO0VuufPgRSRKJEgT4cYs6SoJjmD27fZvfYpw7t3yQ8OcFUFUjYxREOGOh75zEZ/vO9NSG9VhAOJoH/xAidefYn22hoyS2OcEgnyZALtmhjOOQa3brP94VX2b9ykGAz8Ka41Qin/fbPB+bN6zwIEAmcsSinay8usvvgCa6+/hlDqke5hRCTIF9hk4JhajGo8YfvqVbb/9AGjrS2ctUitkfVme5aEeOSKBsJai7CO7unT9M+eoXvmNP1LFx5qHSMiQb6QK1UMhmy+93u2P/iQ4mCAUAqZaB82HKZHFf4eW1W4yqDShLWXX2b1hefpnj0zZyEjUSJBPpcY5WjExjvvsvWnDyiHQ2SSILUOqdxD/IiE8EbFOkxRkrZa9E6dYuXlF1l+/vLUIsY4JRLkQeSwxrD5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";
const ADMIN_PASSWORD = "liveta2024";
const LINE_PAY_URL = "https://line.me/R/pay/payment?action=reserve&encPath=3LalDOBtaG%252BfOQPfnbqO83EJUw%252F%252BT4kr9hdSAskChhhQDjw5UaaVT6XpZr7o6S0F&merchantProvider=LINEPAY#~";
const ATM_INFO = { bank: "中國信託（822）", account: "901561833284" };
const API = "https://script.google.com/macros/s/AKfycbxvJNW7pSz1Fx9EwkqigqJP40y7Yl4NEtsfJhWQgUYTsmrVXxH1xW0rYswTqO9y7jhsyQ/exec";

const PAYMENT_OPTIONS = [
  { value: "cash_on_pickup", label: "當天取貨付款", icon: "💵", desc: "現金或 LINE Pay 當場付款" },
  { value: "line_pay", label: "LINE Pay", icon: "💚", desc: "點擊後跳轉 LINE Pay 付款" },
  { value: "atm", label: "ATM 轉帳", icon: "🏦", desc: "匯款後提供末 5 碼核對" },
];

const C = {
  ink: "#2d1f22", rose: "#c4727a", rosePale: "#f9edf0", roseMid: "#f0d0d5",
  cream: "#fdf8f8", white: "#ffffff", muted: "#9a7a80", border: "#e8cdd1",
  green: "#4a7c5e", greenPale: "#e8f2ec", red: "#8b2e2e", redPale: "#f9eaea",
  amber: "#8a6200", amberPale: "#fff8e1",
};

const S = {
  page: { minHeight: "100vh", background: C.cream, fontFamily: "'Georgia','Times New Roman',serif", color: C.ink },
  header: { background: "#f2e0e3", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  container: { maxWidth: "520px", margin: "0 auto", padding: "24px 16px" },
  card: { background: C.white, border: `1px solid ${C.border}`, borderRadius: "6px", padding: "20px", marginBottom: "16px" },
  label: { display: "block", fontSize: "11px", letterSpacing: "0.15em", color: C.muted, marginBottom: "6px", fontFamily: "sans-serif", textTransform: "uppercase" },
  input: { width: "100%", border: `1px solid ${C.border}`, borderRadius: "4px", padding: "10px 12px", fontSize: "15px", fontFamily: "sans-serif", color: C.ink, background: C.cream, boxSizing: "border-box", outline: "none" },
  select: { width: "100%", border: `1px solid ${C.border}`, borderRadius: "4px", padding: "10px 12px", fontSize: "15px", fontFamily: "sans-serif", color: C.ink, background: C.cream, boxSizing: "border-box", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239a7a80' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" },
  btnRose: { background: C.rose, color: C.white, border: "none", borderRadius: "4px", padding: "13px 24px", fontSize: "14px", letterSpacing: "0.08em", fontFamily: "sans-serif", cursor: "pointer", width: "100%" },
  btnOutline: { background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: "4px", padding: "8px 16px", fontSize: "13px", fontFamily: "sans-serif", cursor: "pointer" },
  divider: { borderTop: `1px solid ${C.border}`, margin: "16px 0" },
  tag: (color, bg) => ({ display: "inline-block", padding: "2px 8px", borderRadius: "3px", fontSize: "11px", fontFamily: "sans-serif", color, background: bg }),
};

const payLabel = (p) => p === "line_pay" ? "LINE Pay（預付）" : p === "atm" ? "ATM 轉帳" : "當天取貨付款";

// ── API helpers ────────────────────────────────────────────
async function apiGet(action) {
  const res = await fetch(`${API}?action=${action}`);
  return res.json();
}

async function apiPost(body) {
  await fetch(API, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(body) });
}

// ── Header ─────────────────────────────────────────────────
// ── 庫存群組 helpers ───────────────────────────────────────
function getGroupStock(stockGroups, groupId) {
  if (!groupId || !stockGroups) return null;
  return stockGroups.find(g => String(g.id) === String(groupId)) || null;
}

function getEffectiveStock(item, stockGroups) {
  if (item.groupId && stockGroups && stockGroups.length > 0) {
    const group = stockGroups.find(g => String(g.id) === String(item.groupId));
    if (group) {
      const units = item.groupUnits || 1;
      return Math.floor(Number(group.stock) / units);
    }
  }
  // 沒有群組或找不到群組，用品項自己的庫存
  return Number(item.stock) || 0;
}

function Header() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Zen+Kurenaido&family=Cormorant+Garamond:ital@1&display=swap" rel="stylesheet" />
      <header style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={LOGO_B64} alt="Liveta" style={{ height: "56px", width: "56px", objectFit: "contain" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontSize: "22px", letterSpacing: "0.1em", color: C.ink, fontFamily: "'Zen Kurenaido', cursive", fontWeight: "400" }}>莉薇塔</span>
            <span style={{ fontSize: "16px", letterSpacing: "0.18em", color: C.muted, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", fontWeight: "400" }}>Liveta</span>
          </div>
        </div>
      </header>
    </>
  );
}

// ── ProductCard ─────────────────────────────────────────────
function ProductCard({ product, qty, onChange, settings }) {
  const effectiveStock = getEffectiveStock(product, settings?.stockGroups);
  const soldOut = effectiveStock <= 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  return (
    <div style={{ ...S.card, opacity: soldOut ? 0.55 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <div>
          <div style={{ fontSize: "11px", fontFamily: "sans-serif", color: C.muted, marginBottom: "3px" }}>{product.type === "drink" ? "🧋 飲品" : "🍰 甜點"}</div>
          <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "4px" }}>{product.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: C.rose, fontSize: "15px", fontFamily: "sans-serif" }}>NT$ {product.price}</span>
            {hasDiscount && <span style={{ color: C.muted, fontSize: "12px", fontFamily: "sans-serif", textDecoration: "line-through" }}>NT$ {product.originalPrice}</span>}
            {hasDiscount && <span style={S.tag(C.red, C.redPale)}>特價</span>}
            <span style={{ color: C.muted, fontSize: "12px", fontFamily: "sans-serif" }}>/ {product.unit}</span>
          </div>
          {product.desc && <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.muted, marginTop: "6px", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>{product.desc}</div>}
        </div>
        <div style={S.tag(soldOut ? C.red : C.green, soldOut ? C.redPale : C.greenPale)}>{soldOut ? "售完" : "供應中"}</div>
      </div>
      {!soldOut && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => onChange(Math.max(0, qty - 1))} style={{ width: "32px", height: "32px", border: `1px solid ${C.border}`, borderRadius: "4px", background: C.cream, cursor: "pointer", fontSize: "18px", color: C.muted }}>−</button>
          <span style={{ fontFamily: "sans-serif", fontSize: "16px", minWidth: "20px", textAlign: "center" }}>{qty}</span>
          <button onClick={() => onChange(Math.min(effectiveStock, qty + 1))} style={{ width: "32px", height: "32px", border: `1px solid ${C.border}`, borderRadius: "4px", background: C.cream, cursor: "pointer", fontSize: "18px", color: C.ink }}>+</button>
          {qty > 0 && <span style={{ marginLeft: "auto", color: C.rose, fontFamily: "sans-serif", fontSize: "14px" }}>小計 NT$ {product.price * qty}</span>}
        </div>
      )}
    </div>
  );
}

// ── GiftSection ─────────────────────────────────────────────
function GiftSection({ gifts, giftQty, giftCart, onChangeGift, stockGroups }) {
  if (giftQty === 0 || gifts.length === 0) return null;
  const availableGifts = gifts.filter(g => {
    if (g.groupId && stockGroups) {
      const group = stockGroups.find(gr => gr.id === g.groupId);
      if (group) return group.stock > 0;
    }
    return g.stock > 0;
  });
  const chosen = Object.values(giftCart).reduce((s, q) => s + q, 0);
  const remaining = giftQty - chosen;
  return (
    <div style={{ ...S.card, background: C.amberPale, border: `1px solid #e8d080` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🎁</span>
          <div style={{ fontSize: "15px", fontWeight: "500" }}>恭喜！獲得 {giftQty} 份贈品</div>
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: remaining > 0 ? C.amber : C.green, fontWeight: "600" }}>
          {remaining > 0 ? `還可選 ${remaining} 份` : "✓ 已選完"}
        </div>
      </div>
      <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.amber, marginBottom: "12px" }}>可混搭不同贈品，合計 {giftQty} 份</div>
      {availableGifts.length === 0 ? (
        <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted }}>贈品暫時售完，感謝您的支持</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {availableGifts.map(g => {
            const qty = giftCart[g.id] || 0;
            return (
              <div key={g.id} style={{ padding: "12px 14px", border: `1px solid ${qty > 0 ? "#b8960a" : "#e0c84a"}`, borderRadius: "6px", background: qty > 0 ? "#fffbe6" : C.white, display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: "14px", fontWeight: "500", color: C.ink }}>{g.name}</div>
                  {g.desc && <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.muted, marginTop: "2px" }}>{g.desc}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button onClick={() => onChangeGift(g.id, Math.max(0, qty - 1))} style={{ width: "28px", height: "28px", border: `1px solid ${C.border}`, borderRadius: "4px", background: C.cream, cursor: "pointer", fontSize: "16px", color: C.muted }}>−</button>
                  <span style={{ fontFamily: "sans-serif", fontSize: "15px", minWidth: "16px", textAlign: "center", color: qty > 0 ? "#b8960a" : C.ink, fontWeight: qty > 0 ? "600" : "400" }}>{qty}</span>
                  <button onClick={() => {
                    if (remaining <= 0) return;
                    const gGroup = g.groupId && stockGroups ? stockGroups.find(gr => gr.id === g.groupId) : null;
                    const groupAvail = gGroup ? gGroup.stock - Object.entries(giftCart).reduce((s,[id,q]) => { const og = gifts?.find(x=>x.id===Number(id)); return og?.groupId===g.groupId ? s+q*(og.groupUnits||1) : s; }, 0) >= (g.groupUnits||1) : true;
                    if (groupAvail) onChangeGift(g.id, qty + 1);
                  }} style={{ width: "28px", height: "28px", border: `1px solid ${C.border}`, borderRadius: "4px", background: remaining > 0 ? C.cream : "#f0f0f0", cursor: remaining > 0 ? "pointer" : "default", fontSize: "16px", color: remaining > 0 ? C.ink : C.muted }}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── OrderPage ───────────────────────────────────────────────
function OrderPage({ products, gifts, settings, onSubmit, onSaveSettings }) {
  const { isOpen, openInfo, noticeText, successNote, pickupSlots, pickupLocations } = settings;
  const [cart, setCart] = useState({});
  const [giftCart, setGiftCart] = useState({});
  const [form, setForm] = useState({ name: "", phone: "", pickupLocation: "", pickupTime: "", payment: "", note: "", proofFile: null, atmLast5: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [error, setError] = useState("");
  const [noticeSeen, setNoticeSeen] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const fileRef = useRef();

  const desserts = products.filter(p => !p.type || p.type === "dessert");
  const drinks = products.filter(p => p.type === "drink");
  const dessertQty = desserts.reduce((s, p) => s + (cart[p.id] || 0), 0);
  const drinkQty = drinks.reduce((s, p) => s + (cart[p.id] || 0), 0);
  const giftQty = Math.min(dessertQty, drinkQty);
  const total = Object.entries(cart).reduce((s, [id, qty]) => { const p = products.find(p => p.id === Number(id)); return p ? s + p.price * qty : s; }, 0);
  const hasItems = Object.values(cart).some(q => q > 0);

  useEffect(() => { if (giftQty === 0) setGiftCart({}); }, [giftQty]);

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
    if (!form.name.trim()) { setSubmitting(false); return setError("請填寫姓名"); }
    if (!form.phone.trim()) return setError("請填寫電話");
    if (pickupLocations && pickupLocations.length > 0 && !form.pickupLocation) return setError("請選擇取貨地點");
    if (!form.pickupTime) return setError("請選擇取貨時間");
    if (!form.payment) return setError("請選擇付款方式");
    if (form.payment === "line_pay" && !form.proofFile) return setError("請上傳 LINE Pay 付款截圖");
    if (form.payment === "atm" && form.atmLast5.trim().length !== 5) return setError("請填寫匯款末 5 碼");
    if (!hasItems) return setError("請至少選擇一項商品");
    const availableGifts = gifts.filter(g => {
      if (g.groupId && settings.stockGroups) {
        const group = settings.stockGroups.find(gr => String(gr.id) === String(g.groupId));
        if (group) return group.stock > 0;
      }
      return g.stock > 0;
    });
    const chosenTotal = Object.values(giftCart).reduce((s, q) => s + q, 0);
    if (giftQty > 0 && availableGifts.length > 0 && chosenTotal < giftQty) return setError(`請選擇 ${giftQty} 份贈品（還差 ${giftQty - chosenTotal} 份）`);
    setError("");
    const items = Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => { const p = products.find(p => p.id === Number(id)); return { productId: p.id, name: p.name, type: p.type, qty, price: p.price }; });
    const giftItems = Object.entries(giftCart).filter(([, q]) => q > 0).map(([id, qty]) => { const g = gifts.find(g => g.id === Number(id)); return { id: g.id, name: g.name, qty }; });
    let proofImage = null;
    if (form.proofFile) {
      proofImage = await new Promise(resolve => { const r = new FileReader(); r.onload = e => resolve(e.target.result); r.readAsDataURL(form.proofFile); });
    }
    const ref = "LV" + Date.now().toString().slice(-6);
    setOrderRef(ref);
    const orderData = { action: "saveOrder", name: form.name, phone: form.phone, pickupLocation: form.pickupLocation, pickupTime: form.pickupTime, payment: form.payment, note: form.note, atmLast5: form.atmLast5, proofImage, items, gifts: giftItems, total, ref };
    await apiPost(orderData);
    // 更新庫存（靜默執行，不影響送出流程）
    try {
      await apiPost({ action: "deductStock", items, gifts: giftItems });
      // 重新拉最新庫存
      const [pRes, gRes, sRes] = await Promise.all([apiGet("getProducts"), apiGet("getGifts"), apiGet("getSettings")]);
      if (pRes.success) setProducts(pRes.products);
      if (gRes.success) setGifts(gRes.gifts);
      if (sRes.success && sRes.settings) {
        const s = sRes.settings;
        if (s.stockGroups) s.stockGroups = s.stockGroups.map(g => ({ ...g, id: Number(g.id), stock: Number(g.stock) }));
        setSettings(prev => ({ ...prev, ...s }));
      }
    } catch(e) { console.log("庫存更新失敗", e); }
    onSubmit(orderData);
    setSubmitting(false);
    setSubmitted(true);
    } catch(err) {
      console.error("送出錯誤:", err);
      setError("送出失敗：" + err.message);
      setSubmitting(false);
    }
  }

  if (!noticeSeen && noticeText) {
    return (
      <div style={S.page}><Header />
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ ...S.card, padding: "0", overflow: "hidden" }}>
            <div style={{ background: C.rose, padding: "16px 20px" }}>
              <div style={{ color: C.white, fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "0.15em", marginBottom: "4px" }}>NOTICE</div>
              <div style={{ color: C.white, fontSize: "18px" }}>訂購須知</div>
            </div>
            <div onScroll={e => { const el = e.target; if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) setScrolledToBottom(true); }}
              style={{ height: "360px", overflowY: "auto", padding: "20px", whiteSpace: "pre-line", fontFamily: "sans-serif", fontSize: "14px", lineHeight: "2", color: C.ink }}>
              {noticeText}<div style={{ height: "20px" }} />
            </div>
            <div style={{ padding: "16px 20px", borderTop: `1px solid ${C.border}`, background: C.cream }}>
              {!scrolledToBottom && <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.muted, textAlign: "center", marginBottom: "10px" }}>↓ 請滑到底部閱讀完畢</div>}
              <button onClick={() => setNoticeSeen(true)} style={{ ...S.btnRose, opacity: scrolledToBottom ? 1 : 0.4, transition: "opacity 0.3s" }}>✓ 已詳閱，開始訂購</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    const giftItems = Object.entries(giftCart).filter(([, q]) => q > 0).map(([id, qty]) => { const g = gifts.find(g => g.id === Number(id)); return { name: g?.name, qty }; });
    return (
      <div style={S.page}><Header />
        <div style={S.container}>
          <div style={{ ...S.card, textAlign: "center", padding: "48px 24px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: C.rosePale, border: `2px solid ${C.rose}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px" }}>✓</div>
            <div style={{ fontSize: "18px", marginBottom: "6px" }}>訂單已送出</div>
            <div style={{ color: C.muted, fontFamily: "sans-serif", fontSize: "13px", marginBottom: "20px" }}>訂單編號 {orderRef}</div>
            <div style={S.divider} />
            <div style={{ fontFamily: "sans-serif", fontSize: "13px", lineHeight: "1.9", textAlign: "left", color: C.muted }}>
              {form.payment === "line_pay" && <div>💚 已收到 LINE Pay 截圖，確認後將通知您</div>}
              {form.payment === "atm" && <div>🏦 已收到匯款末 5 碼：{form.atmLast5}，核對後將通知您</div>}
              {form.payment === "cash_on_pickup" && <div>💵 當天取貨時以現金或 LINE Pay 付款，謝謝您</div>}
              {giftItems.length > 0 && <div style={{ marginTop: "8px", color: C.amber }}>🎁 贈品：{giftItems.map(g => `${g.name} × ${g.qty}`).join("、")}</div>}
              <div style={{ marginTop: "8px" }}>我們確認後會盡快與您聯繫 🤍</div>
            </div>
          </div>
          {successNote && (
            <div style={{ ...S.card, background: C.rosePale, border: `1px solid ${C.roseMid}` }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.rose, letterSpacing: "0.12em", marginBottom: "8px" }}>🌸 貼心提醒</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.ink, lineHeight: "2", whiteSpace: "pre-line" }}>{successNote}</div>
            </div>
          )}
          {settings.eatGuide && (
            <div style={S.card}>
              <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.rose, letterSpacing: "0.12em", marginBottom: "8px" }}>🍽 食用與保存方式</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.ink, lineHeight: "1.9", whiteSpace: "pre-wrap" }}>{settings.eatGuide}</div>
            </div>
          )}
          <div style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted, marginBottom: "14px" }}>追蹤我們，獲得最新消息 🌸</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="https://line.me/R/ti/p/@632olnrv" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", background: "#06c755", borderRadius: "8px", color: "#fff", fontFamily: "sans-serif", fontSize: "14px", textDecoration: "none", fontWeight: "500" }}>
                💬 點我加入官方帳號
              </a>
              <a href="https://www.instagram.com/liveta_tw?igsh=dHB0eHdycDQxdmtw&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", borderRadius: "8px", color: "#fff", fontFamily: "sans-serif", fontSize: "14px", textDecoration: "none", fontWeight: "500" }}>
                📸 點我加入 Instagram
              </a>
              <a href="https://www.threads.com/@liveta_tw?igshid=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", background: "#101010", borderRadius: "8px", color: "#fff", fontFamily: "sans-serif", fontSize: "14px", textDecoration: "none", fontWeight: "500" }}>
                🧵 更多創業日記 Threads
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div style={S.page}><Header />
        <div style={S.container}>
          <div style={{ ...S.card, textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: "30px", marginBottom: "14px" }}>🌸</div>
            <div style={{ fontSize: "17px", marginBottom: "8px" }}>目前未開放訂購</div>
            <div style={{ color: C.muted, fontFamily: "sans-serif", fontSize: "13px", lineHeight: "1.9", whiteSpace: "pre-wrap" }}>{openInfo || "請關注我們的 LINE 社群，開單時間將另行公告"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <Header />
      <div style={S.container}>
        {openInfo && (
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "6px", padding: "14px 16px", marginBottom: "16px" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.rose, letterSpacing: "0.12em", marginBottom: "6px" }}>🗓 本週出攤行程</div>
            <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.ink, lineHeight: "1.8", whiteSpace: "pre-wrap" }}>{openInfo}</div>
          </div>
        )}
        {settings.brandFeature && (
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "6px", padding: "14px 16px", marginBottom: "16px" }}>
            <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.rose, letterSpacing: "0.12em", marginBottom: "6px" }}>✨ 品牌特色</div>
            <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.ink, lineHeight: "1.9", whiteSpace: "pre-wrap" }}>{settings.brandFeature}</div>
          </div>
        )}
        <div style={{ background: C.rosePale, border: `1px solid ${C.roseMid}`, borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <span style={{ fontSize: "18px", flexShrink: 0 }}>🎂</span>
          <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.ink, lineHeight: "1.8" }}>
            訂購 <strong>6吋蛋糕</strong> 或 <strong>生吐司</strong> 請私訊官方帳號或社群，需提前 <strong>一週預訂</strong><br />
            <a href="https://line.me/R/ti/p/@632olnrv" target="_blank" rel="noopener noreferrer" style={{ color: C.rose, fontWeight: "600", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>💬 點我加入官方帳號</a>
          </div>
        </div>
        {giftQty === 0 && gifts.length > 0 && (
          <div style={{ background: C.amberPale, border: "1px solid #e8d080", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", fontFamily: "sans-serif", fontSize: "13px", color: C.amber }}>
            🎁 同時購買甜點＋飲品，各幾項就送幾份贈品！
          </div>
        )}
        {desserts.length > 0 && <>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", fontFamily: "sans-serif", color: C.muted, letterSpacing: "0.15em", marginBottom: "4px" }}>DESSERTS</div>
            <div style={{ fontSize: "18px" }}>🍰 甜點</div>
          </div>
          {desserts.map(p => <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onChange={qty => setCart(c => ({ ...c, [p.id]: qty }))} settings={settings} />)}
        </>}
        {drinks.length > 0 && <>
          <div style={{ marginBottom: "16px", marginTop: "8px" }}>
            <div style={{ fontSize: "11px", fontFamily: "sans-serif", color: C.muted, letterSpacing: "0.15em", marginBottom: "4px" }}>DRINKS</div>
            <div style={{ fontSize: "18px" }}>🧋 飲品</div>
          </div>
          {drinks.map(p => <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onChange={qty => setCart(c => ({ ...c, [p.id]: qty }))} settings={settings} />)}
        </>}
        {desserts.length === 0 && drinks.length === 0 && (
          <div style={{ ...S.card, textAlign: "center", padding: "40px", color: C.muted, fontFamily: "sans-serif" }}>本週品項尚未設定，請稍後再來 🌸</div>
        )}
        {hasItems && (
          <div style={{ ...S.card, background: C.rosePale, border: `1px solid ${C.roseMid}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "sans-serif" }}>
              <span style={{ color: C.muted, fontSize: "13px" }}>合計</span>
              <span style={{ color: C.rose, fontSize: "18px" }}>NT$ {total}</span>
            </div>
          </div>
        )}
        <GiftSection gifts={gifts} giftQty={giftQty} giftCart={giftCart} onChangeGift={(id, qty) => setGiftCart(c => ({ ...c, [id]: qty }))} stockGroups={settings.stockGroups} />
        <div style={S.divider} />
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontFamily: "sans-serif", color: C.muted, letterSpacing: "0.15em", marginBottom: "4px" }}>YOUR INFO</div>
          <div style={{ fontSize: "20px" }}>填寫資料</div>
        </div>
        {[{ key: "name", label: "姓名", placeholder: "您的姓名" }, { key: "phone", label: "電話", placeholder: "0912-345-678" }].map(f => (
          <div key={f.key} style={{ marginBottom: "14px" }}>
            <label style={S.label}>{f.label}</label>
            <input style={S.input} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
          </div>
        ))}
        {pickupLocations && pickupLocations.length > 0 && (
          <div style={{ marginBottom: "14px" }}>
            <label style={S.label}>取貨地點</label>
            <select style={S.select} value={form.pickupLocation} onChange={e => setForm(v => ({ ...v, pickupLocation: e.target.value }))}>
              <option value="">請選擇地點</option>
              {pickupLocations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        )}
        {settings.pickupDate && (
          <div style={{ marginBottom: "14px" }}>
            <label style={S.label}>取貨日期</label>
            <div style={{ padding: "11px 14px", background: C.rosePale, border: `1px solid ${C.border}`, borderRadius: "6px", fontFamily: "sans-serif", fontSize: "14px", color: C.ink }}>📅 {settings.pickupDate}</div>
          </div>
        )}
        <div style={{ marginBottom: "14px" }}>
          <label style={S.label}>取貨時間</label>
          <select style={S.select} value={form.pickupTime} onChange={e => setForm(v => ({ ...v, pickupTime: e.target.value }))}>
            <option value="">請選擇時段</option>
            {pickupSlots && pickupSlots.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: "14px" }}>
          <label style={S.label}>付款方式</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {PAYMENT_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => { setForm(v => ({ ...v, payment: opt.value, proofFile: null, atmLast5: "" })); if (opt.value === "line_pay") window.open(LINE_PAY_URL, "_blank"); }}
                style={{ width: "100%", padding: "12px 14px", border: `1px solid ${form.payment === opt.value ? C.rose : C.border}`, borderRadius: "6px", background: form.payment === opt.value ? C.rosePale : C.white, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>{opt.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "sans-serif", fontSize: "14px", color: form.payment === opt.value ? C.rose : C.ink, fontWeight: "500" }}>{opt.label}</div>
                  <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.muted, marginTop: "1px" }}>{opt.desc}</div>
                </div>
                {form.payment === opt.value && <span style={{ color: C.rose, fontSize: "16px" }}>✓</span>}
              </button>
            ))}
          </div>
          {form.payment === "line_pay" && (
            <div style={{ marginTop: "10px", padding: "14px", background: "#f0faf0", border: "1px solid #a8dab0", borderRadius: "6px" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.green, marginBottom: "8px" }}>✦ 上傳付款截圖</div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => setForm(v => ({ ...v, proofFile: e.target.files[0] }))} />
              <button onClick={() => fileRef.current.click()} style={{ ...S.btnOutline, borderColor: C.green, color: C.green }}>{form.proofFile ? `✓ ${form.proofFile.name}` : "選擇截圖"}</button>
              <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.muted, marginTop: "6px" }}>付款完成後請上傳截圖以利核對</div>
            </div>
          )}
          {form.payment === "atm" && (
            <div style={{ marginTop: "10px", padding: "14px", background: "#f5f0fc", border: "1px solid #c8b4e0", borderRadius: "6px" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: "#6a4a9a", marginBottom: "6px" }}>匯款帳號</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "14px", color: C.ink, lineHeight: "1.8", marginBottom: "10px" }}>{ATM_INFO.bank}<br />帳號：{ATM_INFO.account}</div>
              <div style={S.divider} />
              <label style={{ ...S.label, marginTop: "8px" }}>匯款末 5 碼</label>
              <input style={{ ...S.input, letterSpacing: "0.2em", fontSize: "18px" }} maxLength={5} placeholder="例：83284" value={form.atmLast5} onChange={e => setForm(v => ({ ...v, atmLast5: e.target.value.replace(/\D/g, "") }))} />
              <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.muted, marginTop: "6px" }}>送出訂單前轉帳匯款並填寫末 5 碼</div>
            </div>
          )}
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={S.label}>備註（選填）</label>
          <textarea style={{ ...S.input, height: "72px", resize: "vertical" }} placeholder="過敏、口味偏好、其他需求…" value={form.note} onChange={e => setForm(v => ({ ...v, note: e.target.value }))} />
        </div>
        {error && <div style={{ padding: "10px 14px", marginBottom: "14px", background: C.redPale, border: "1px solid #e0b0b0", borderRadius: "4px", fontFamily: "sans-serif", fontSize: "13px", color: C.red }}>{error}</div>}
        <button style={{ ...S.btnRose, opacity: submitting ? 0.6 : 1 }} onClick={handleSubmit} disabled={submitting}>{submitting ? "送出中…" : "確認送出訂單"}</button>
        <p style={{ textAlign: "center", color: C.muted, fontSize: "11px", fontFamily: "sans-serif", marginTop: "12px", letterSpacing: "0.05em" }}>手工製作・限量預購・感謝您的等待</p>
      </div>
    </div>
  );
}

// ── AdminPanel ──────────────────────────────────────────────
function GroupsTab({ settings, setSettings, onSaveSettings, products, gifts }) {
  const stockGroups = settings.stockGroups || [];
  const [newGroup, setNewGroup] = useState({ name: "", stock: "" });
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save(newGroups) {
    setSaving(true);
    const newSettings = { ...settings, stockGroups: newGroups };
    setSettings(newSettings);
    await onSaveSettings(newSettings);
    setSaving(false);
  }

  // Get items bound to a group
  function getGroupMembers(groupId) {
    const prods = products.filter(p => p.groupId === groupId).map(p => `🍰 ${p.name}（×${p.groupUnits || 1}顆/單位）`);
    const gs = gifts.filter(g => g.groupId === groupId).map(g => `🎁 ${g.name}（×${g.groupUnits || 1}顆/單位）`);
    return [...prods, ...gs];
  }

  return (
    <div>
      <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted, marginBottom: "16px", padding: "12px 14px", background: C.rosePale, borderRadius: "6px", border: `1px solid ${C.roseMid}` }}>
        📦 設定庫存群組後，在品項或贈品編輯時選擇群組，訂購或贈送都會從同一個總庫存扣除。
      </div>
      {saving && <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.muted, marginBottom: "8px" }}>儲存中…</div>}
      {stockGroups.map(g => (
        <div key={g.id} style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <div>
              <div style={{ fontSize: "16px", marginBottom: "4px" }}>{g.name}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted }}>
                剩餘庫存：<span style={{ color: g.stock <= 0 ? C.red : C.green, fontWeight: "600" }}>{g.stock}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input type="text" inputMode="numeric" style={{ ...S.input, width: "80px", padding: "6px 10px" }} onFocus={e => { if(e.target.value==="0") e.target.value=""; }} value={g.stock}
                onChange={e => { const newGroups = stockGroups.map(x => x.id === g.id ? { ...x, stock: Number(e.target.value) } : x); save(newGroups); }} />
              <button style={{ ...S.btnOutline, borderColor: C.red, color: C.red, padding: "6px 10px" }}
                onClick={() => save(stockGroups.filter(x => x.id !== g.id))}>刪除</button>
            </div>
          </div>
          {getGroupMembers(g.id).length > 0 && (
            <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.muted, lineHeight: "1.8", borderTop: `1px solid ${C.border}`, paddingTop: "8px" }}>
              {getGroupMembers(g.id).map((m, i) => <div key={i}>{m}</div>)}
            </div>
          )}
        </div>
      ))}
      {showNew ? (
        <div style={S.card}>
          <div style={{ marginBottom: "10px" }}>
            <label style={S.label}>群組名稱</label>
            <input style={S.input} value={newGroup.name} onChange={e => setNewGroup(v => ({ ...v, name: e.target.value }))} placeholder="例：Q球、原味費南雪" />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label style={S.label}>總庫存數量</label>
            <input type="text" inputMode="numeric" style={S.input} value={newGroup.stock} onFocus={e => { if(e.target.value==="0") e.target.value=""; }} onChange={e => setNewGroup(v => ({ ...v, stock: e.target.value }))} placeholder="例：100" />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ ...S.btnRose, width: "auto", padding: "8px 20px" }} onClick={() => {
              if (!newGroup.name.trim() || !newGroup.stock) return;
              save([...stockGroups, { id: Date.now(), name: newGroup.name.trim(), stock: Number(newGroup.stock) }]);
              setNewGroup({ name: "", stock: "" }); setShowNew(false);
            }}>新增</button>
            <button style={S.btnOutline} onClick={() => setShowNew(false)}>取消</button>
          </div>
        </div>
      ) : (
        <button style={{ ...S.btnOutline, width: "100%", padding: "12px", borderStyle: "dashed" }} onClick={() => setShowNew(true)}>＋ 新增庫存群組</button>
      )}
    </div>
  );
}

function AdminPanel({ products, setProducts, gifts, setGifts, orders, setOrders, settings, setSettings, onSaveProducts, onSaveGifts, onSaveSettings }) {
  const [tab, setTab] = useState("orders");
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", originalPrice: "", stock: "", unit: "個", type: "dessert" });
  const [showNewProd, setShowNewProd] = useState(false);
  const [editGift, setEditGift] = useState(null);
  const [newGift, setNewGift] = useState({ name: "", desc: "", stock: "" });
  const [showNewGift, setShowNewGift] = useState(false);
  const [newSlot, setNewSlot] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const moveTimer = useRef(null);

  const { isOpen, openInfo, noticeText, successNote, pickupSlots, pickupLocations } = settings;

  const statusColors = { "待確認": { c: "#7a5c00", bg: "#fff8e1" }, "已確認": { c: C.green, bg: C.greenPale }, "已取消": { c: C.red, bg: C.redPale }, "已完成": { c: C.muted, bg: C.border } };
  const tabStyle = (a) => ({ padding: "10px 12px", border: "none", borderBottom: `2px solid ${a ? C.rose : "transparent"}`, background: "transparent", color: a ? C.rose : C.muted, fontFamily: "sans-serif", fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap" });

  async function save(fn) { setSaving(true); await fn(); setSaving(false); }

  function exportCSV() {
    const rows = [["訂單編號","姓名","電話","取貨地點","取貨時間","付款方式","ATM末5碼","商品","贈品","總金額","狀態","時間","備註"]];
    orders.forEach(o => {
      const dess = (o.items||[]).filter(i => !i.type||i.type==="dessert").map(i=>`${i.name}×${i.qty}`).join("、");
      const drks = (o.items||[]).filter(i=>i.type==="drink").map(i=>`${i.name}×${i.qty}`).join("、");
      rows.push([o.ref,o.name,o.phone,o.pickupLocation||"",o.pickupTime,payLabel(o.payment),o.atmLast5||"",dess,drks,(o.gifts||[]).map(g=>`${g.name}×${g.qty}`).join("、"),o.total,o.status,o.createdAt||"",o.note||""]);
    });
    const csv = rows.map(r=>r.map(c=>`"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`莉薇塔訂單_${new Date().toLocaleDateString("zh-TW")}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  const typeToggle = (obj, setObj) => (
    <div style={{ marginBottom: "12px" }}>
      <label style={S.label}>類型</label>
      <div style={{ display: "flex", gap: "8px" }}>
        {[["dessert","🍰 甜點"],["drink","🧋 飲品"]].map(([val,lbl]) => (
          <button key={val} onClick={() => setObj(v=>({...v,type:val}))} style={{ flex:1, padding:"8px", border:`1px solid ${obj.type===val?C.rose:C.border}`, borderRadius:"4px", background:obj.type===val?C.rosePale:"transparent", fontFamily:"sans-serif", fontSize:"13px", cursor:"pointer", color:obj.type===val?C.rose:C.muted }}>{lbl}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ ...S.page, background: "#f8f2f3" }}>
      <header style={{ ...S.header, justifyContent: "space-between" }}>
        <div>
          <p style={{ color: C.roseMid, fontSize: "18px", letterSpacing: "0.12em", margin: 0 }}>莉薇塔 後台</p>
          <p style={{ color: C.muted, fontSize: "10px", letterSpacing: "0.2em", marginTop: "2px", fontFamily: "sans-serif" }}>ADMIN PANEL</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {saving && <span style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.muted }}>儲存中…</span>}
          <span style={{ fontFamily: "sans-serif", fontSize: "12px", color: isOpen ? "#a8d8a8" : C.muted }}>{isOpen ? "🟢 開單中" : "🔴 未開單"}</span>
          <button onClick={() => save(() => onSaveSettings({ ...settings, isOpen: !isOpen }))}
            style={{ background: isOpen ? C.red : C.green, color: C.white, border: "none", borderRadius: "4px", padding: "8px 14px", fontFamily: "sans-serif", fontSize: "12px", cursor: "pointer" }}>
            {isOpen ? "關閉訂單" : "開放訂單"}
          </button>
        </div>
      </header>
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, display: "flex", paddingLeft: "8px", overflowX: "auto" }}>
        {[["orders","📋 訂單"],["stats","📊 統計"],["products","🍰 品項"],["gifts","🎁 贈品"],["groups","📦 庫存群組"],["settings","⚙️ 設定"]].map(([key,label]) => (
          <button key={key} style={tabStyle(tab===key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "20px 16px" }}>

        {tab === "orders" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted }}>共 {orders.length} 筆</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ ...S.btnOutline }} onClick={async () => { const oRes = await apiGet("getOrders"); if (oRes.success) setOrders(oRes.orders || []); }}>🔄 重新整理</button>
                <button style={{ ...S.btnOutline, borderColor: C.rose, color: C.rose }} onClick={exportCSV}>匯出 CSV</button>
              </div>
            </div>
            {orders.length === 0 && <div style={{ ...S.card, textAlign: "center", padding: "40px", color: C.muted, fontFamily: "sans-serif" }}>尚無訂單</div>}
            {[...orders].reverse().map((o, oi) => (
              <div key={o.ref || oi} style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.muted }}>{o.ref} · {o.createdAt || ""}</div>
                    <div style={{ fontSize: "16px", fontWeight: "500" }}>{o.name} <span style={{ fontSize: "13px", color: C.muted, fontFamily: "sans-serif" }}>{o.phone}</span></div>
                  </div>
                  <span style={S.tag(statusColors[o.status]?.c||C.muted, statusColors[o.status]?.bg||C.border)}>{o.status||"待確認"}</span>
                </div>
                <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted, marginBottom: "8px", lineHeight: "1.8" }}>
                  {o.pickupLocation && <span>📍 {o.pickupLocation}　</span>}{settings.pickupDate && <span>📅 {settings.pickupDate}　</span>}⏰ {typeof o.pickupTime === "string" ? (o.pickupTime.includes("1899") ? o.pickupTime.match(/(\d{2}:\d{2})/) ? o.pickupTime.match(/(\d{2}:\d{2})/)[1] : "" : o.pickupTime) : ""}　💳 {payLabel(o.payment)}
                  {o.payment === "atm" && o.atmLast5 && <span style={{ color: C.ink }}>　末5碼：{o.atmLast5}</span>}
                  {o.payment === "line_pay" && !o.proofImage && <span style={{ color: C.red }}>　⚠未截圖</span>}
                </div>
                {o.proofImage && (
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.green, marginBottom: "6px" }}>💚 LINE Pay 付款截圖</div>
                    <img src={o.proofImage} alt="付款截圖" style={{ maxWidth: "100%", maxHeight: "240px", objectFit: "contain", borderRadius: "6px", border: `1px solid ${C.border}`, display: "block" }} />
                  </div>
                )}
                <div style={{ fontFamily: "sans-serif", fontSize: "13px", marginBottom: "4px" }}>
                  {(o.items||[]).map(i => <span key={i.productId} style={{ marginRight: "10px" }}>{i.name} ×{i.qty}</span>)}
                </div>
                {o.gifts && o.gifts.length > 0 && <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.amber, marginBottom: "4px" }}>🎁 {o.gifts.map(g=>`${g.name} × ${g.qty}`).join("、")}</div>}
                {o.note && <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.muted, marginBottom: "8px" }}>備註：{o.note}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                  <span style={{ color: C.rose, fontFamily: "sans-serif" }}>NT$ {o.total}</span>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {["待確認","已確認","已完成","已取消"].map(s => (
                      <button key={s} onClick={async () => {
                        const prevStatus = (o.status || "").trim();
                        const newOrders = orders.map(x => x.ref===o.ref ? {...x,status:s} : x);
                        setOrders(newOrders);
                        await apiPost({ action: "updateOrderStatus", ref: o.ref, status: s });
                        // 已取消 → 補回庫存
                        if (s === "已取消" && prevStatus !== "已取消") {
                          try {
                            const restoreItems = (o.items || []).map(i => ({ name: i.name, qty: Number(i.qty), productId: i.productId || null }));
                            const restoreGifts = (o.gifts || []).map(g => ({ name: g.name, qty: Number(g.qty), id: g.id || null }));
                            await apiPost({ action: "restoreStock", items: restoreItems, gifts: restoreGifts });
                            const [pRes, gRes, sRes] = await Promise.all([apiGet("getProducts"), apiGet("getGifts"), apiGet("getSettings")]);
                            if (pRes.success) setProducts(pRes.products);
                            if (gRes.success) setGifts(gRes.gifts);
                            if (sRes.success && sRes.settings) { const s2 = sRes.settings; if (s2.stockGroups) s2.stockGroups = s2.stockGroups.map(g => ({...g, id: Number(g.id), stock: Number(g.stock)})); setSettings(prev => ({...prev, ...s2})); }
                          } catch(e) { alert("補回庫存失敗：" + e.message); }
                        }
                        // 從已取消改回其他狀態 → 重新扣庫存
                        if (prevStatus === "已取消" && s !== "已取消") {
                          try {
                            const deductItems = (o.items || []).map(i => ({ name: i.name, qty: Number(i.qty), productId: i.productId || null }));
                            const deductGifts = (o.gifts || []).map(g => ({ name: g.name, qty: Number(g.qty), id: g.id || null }));
                            await apiPost({ action: "deductStock", items: deductItems, gifts: deductGifts });
                            const [pRes, gRes, sRes] = await Promise.all([apiGet("getProducts"), apiGet("getGifts"), apiGet("getSettings")]);
                            if (pRes.success) setProducts(pRes.products);
                            if (gRes.success) setGifts(gRes.gifts);
                            if (sRes.success && sRes.settings) { const s2 = sRes.settings; if (s2.stockGroups) s2.stockGroups = s2.stockGroups.map(g => ({...g, id: Number(g.id), stock: Number(g.stock)})); setSettings(prev => ({...prev, ...s2})); }
                          } catch(e) { alert("扣庫存失敗：" + e.message); }
                        }
                                            }} style={{ padding:"4px 8px", border:`1px solid ${o.status===s?C.rose:C.border}`, borderRadius:"3px", background:o.status===s?C.rosePale:"transparent", color:o.status===s?C.rose:C.muted, fontFamily:"sans-serif", fontSize:"11px", cursor:"pointer" }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "stats" && (
          <>
            <div style={{ ...S.card }}>
              <div style={{ fontSize: "15px", marginBottom: "16px" }}>🍰 品項統計</div>
              {(() => {
                const countMap = {};
                orders.filter(o => o.status !== "已取消").forEach(o => {
                  (o.items || []).forEach(i => {
                    countMap[i.name] = (countMap[i.name] || 0) + i.qty;
                  });
                });
                const entries = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
                return entries.length === 0
                  ? <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted }}>尚無訂單資料</div>
                  : entries.map(([name, qty]) => (
                    <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontFamily: "sans-serif", fontSize: "14px" }}>{name}</span>
                      <span style={{ fontFamily: "sans-serif", fontSize: "16px", color: C.rose, fontWeight: "600" }}>{qty}</span>
                    </div>
                  ));
              })()}
            </div>
            <div style={{ ...S.card }}>
              <div style={{ fontSize: "15px", marginBottom: "16px" }}>🎁 贈品統計</div>
              {(() => {
                const giftMap = {};
                orders.filter(o => o.status !== "已取消").forEach(o => {
                  (o.gifts || []).forEach(g => {
                    giftMap[g.name] = (giftMap[g.name] || 0) + g.qty;
                  });
                });
                const entries = Object.entries(giftMap).sort((a, b) => b[1] - a[1]);
                return entries.length === 0
                  ? <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted }}>尚無贈品資料</div>
                  : entries.map(([name, qty]) => (
                    <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ fontFamily: "sans-serif", fontSize: "14px" }}>{name}</span>
                      <span style={{ fontFamily: "sans-serif", fontSize: "16px", color: C.amber, fontWeight: "600" }}>{qty}</span>
                    </div>
                  ));
              })()}
            </div>
          </>
        )}

        {tab === "products" && (
          <>
            {products.map(p => (
              <div key={p.id} style={S.card}>
                {editProduct?.id === p.id ? (
                  <div>
                    {[["name","品項名稱","text"],["price","售價","number"],["originalPrice","原價（選填，填了才顯示劃線原價）","number"],["stock","庫存數量（無群組時使用）","number"],["unit","單位","text"]].map(([k,label,type]) => (
                      <div key={k} style={{ marginBottom: "10px" }}>
                        <label style={S.label}>{label}</label>
                        <input type="text" inputMode={type==="number"?"numeric":"text"} style={S.input} value={editProduct[k]??""} onChange={e => setEditProduct(v=>({...v,[k]:e.target.value}))} />
                      </div>
                    ))}
                    <div style={{ marginBottom: "10px" }}>
                      <label style={S.label}>品項說明（選填，可換行）</label>
                      <textarea style={{ ...S.input, height: "80px", resize: "vertical", lineHeight: "1.8" }} value={editProduct.desc || ""} onChange={e => setEditProduct(v => ({ ...v, desc: e.target.value }))} placeholder="例：內含抹茶奶油夾心，建議冷藏保存…" />
                    </div>
                    {typeToggle(editProduct, setEditProduct)}
                    <div style={{ marginBottom: "12px" }}>
                      <label style={S.label}>庫存群組（選填）</label>
                      <select style={S.select} value={editProduct.groupId || ""} onChange={e => setEditProduct(v => ({ ...v, groupId: e.target.value ? Number(e.target.value) : null }))}>
                        <option value="">不使用群組</option>
                        {(settings.stockGroups || []).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                      {editProduct.groupId && (
                        <div style={{ marginTop: "8px" }}>
                          <label style={S.label}>此品項消耗幾顆群組庫存</label>
                          <input type="text" inputMode="numeric" style={S.input} value={editProduct.groupUnits || ""} onFocus={e => { if(e.target.value==="0"||e.target.value==="1") e.target.select(); }} onChange={e => setEditProduct(v => ({ ...v, groupUnits: e.target.value }))} />
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button style={{ ...S.btnRose, width: "auto", padding: "8px 20px" }} onClick={() => save(async () => { const ep = {...editProduct, price: Number(editProduct.price)||0, originalPrice: editProduct.originalPrice?Number(editProduct.originalPrice):null, stock: Number(editProduct.stock)||0 }; const newProds = products.map(x=>x.id===ep.id?ep:x); setProducts(newProds); await onSaveProducts(newProds); setEditProduct(null); })}>儲存</button>
                      <button style={S.btnOutline} onClick={() => setEditProduct(null)}>取消</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginRight: "8px" }}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: C.muted, lineHeight: 1, padding: "2px" }} onClick={() => { const i = products.findIndex(x => x.id === p.id); if (i <= 0) return; const a = [...products]; [a[i-1], a[i]] = [a[i], a[i-1]]; setProducts(a); clearTimeout(moveTimer.current); moveTimer.current = setTimeout(() => onSaveProducts(a), 600); }}>▲</button>
                      <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: C.muted, lineHeight: 1, padding: "2px" }} onClick={() => { const i = products.findIndex(x => x.id === p.id); if (i >= products.length - 1) return; const a = [...products]; [a[i], a[i+1]] = [a[i+1], a[i]]; setProducts(a); clearTimeout(moveTimer.current); moveTimer.current = setTimeout(() => onSaveProducts(a), 600); }}>▼</button>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "11px", fontFamily: "sans-serif", color: C.muted, marginBottom: "2px" }}>{p.type==="drink"?"🧋 飲品":"🍰 甜點"}</div>
                      <div style={{ fontSize: "15px", marginBottom: "2px" }}>{p.name}</div>
                      <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted }}>
                        <span style={{ color: C.rose }}>NT$ {p.price}</span>
                        {p.originalPrice && <span style={{ textDecoration: "line-through", marginLeft: "6px" }}>NT$ {p.originalPrice}</span>}
                        　/ {p.unit}　庫存 {p.stock}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button style={S.btnOutline} onClick={() => setEditProduct({...p})}>編輯</button>
                      <button style={{ ...S.btnOutline, borderColor: C.red, color: C.red }} onClick={() => save(async () => { const newProds = products.filter(x=>x.id!==p.id); setProducts(newProds); await onSaveProducts(newProds); })}>刪除</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {showNewProd ? (
              <div style={S.card}>
                <div style={{ fontSize: "14px", marginBottom: "14px", color: C.muted, fontFamily: "sans-serif" }}>新增品項</div>
                {[["name","品項名稱","text"],["price","售價","number"],["originalPrice","原價（選填）","number"],["stock","庫存數量","number"],["unit","單位","text"]].map(([k,label,type]) => (
                  <div key={k} style={{ marginBottom: "10px" }}>
                    <label style={S.label}>{label}</label>
                    <input type="text" inputMode={type==="number"?"numeric":"text"} style={S.input} value={newProduct[k]??""} onChange={e => setNewProduct(v=>({...v,[k]:e.target.value}))} />
                  </div>
                ))}
                {typeToggle(newProduct, setNewProduct)}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ ...S.btnRose, width: "auto", padding: "8px 20px" }} onClick={() => {
                    if (!newProduct.name||!newProduct.price||!newProduct.stock) return;
                    save(async () => {
                      const newProds = [...products, { ...newProduct, id: Date.now(), price: Number(newProduct.price), originalPrice: newProduct.originalPrice?Number(newProduct.originalPrice):null, stock: Number(newProduct.stock) }];
                      setProducts(newProds); await onSaveProducts(newProds);
                      setNewProduct({ name:"",price:"",originalPrice:"",stock:"",unit:"個",type:"dessert" }); setShowNewProd(false);
                    });
                  }}>新增</button>
                  <button style={S.btnOutline} onClick={() => setShowNewProd(false)}>取消</button>
                </div>
              </div>
            ) : (
              <button style={{ ...S.btnOutline, width: "100%", padding: "12px", borderStyle: "dashed" }} onClick={() => setShowNewProd(true)}>＋ 新增品項</button>
            )}
          </>
        )}

        {tab === "gifts" && (
          <>
            <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted, marginBottom: "16px", padding: "12px 14px", background: C.amberPale, borderRadius: "6px", border: "1px solid #e8d080" }}>
              🎁 甜點幾個＋飲品幾個，就送幾份贈品（取兩者最小值）
            </div>
            {gifts.map(g => (
              <div key={g.id} style={S.card}>
                {editGift?.id === g.id ? (
                  <div>
                    {[["name","贈品名稱"],["desc","說明（選填）"],["stock","庫存數量"]].map(([k,label]) => (
                      <div key={k} style={{ marginBottom: "10px" }}>
                        <label style={S.label}>{label}</label>
                        <input type={k==="stock"?"number":"text"} style={S.input} value={editGift[k]??""} onChange={e => setEditGift(v=>({...v,[k]:k==="stock"?Number(e.target.value):e.target.value}))} />
                      </div>
                    ))}
                    <div style={{ marginBottom: "10px" }}>
                      <label style={S.label}>庫存群組（選填）</label>
                      <select style={S.select} value={editGift.groupId || ""} onChange={e => setEditGift(v => ({ ...v, groupId: e.target.value ? Number(e.target.value) : null }))}>
                        <option value="">不使用群組</option>
                        {(settings.stockGroups || []).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                      {editGift.groupId && (
                        <div style={{ marginTop: "8px" }}>
                          <label style={S.label}>此贈品消耗幾顆群組庫存</label>
                          <input type="text" inputMode="numeric" style={S.input} value={editGift.groupUnits || ""} onFocus={e => { if(e.target.value==="0"||e.target.value==="1") e.target.select(); }} onChange={e => setEditGift(v => ({ ...v, groupUnits: e.target.value }))} />
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button style={{ ...S.btnRose, width: "auto", padding: "8px 20px" }} onClick={() => save(async () => { const newGifts = gifts.map(x=>x.id===editGift.id?editGift:x); setGifts(newGifts); await onSaveGifts(newGifts); setEditGift(null); })}>儲存</button>
                      <button style={S.btnOutline} onClick={() => setEditGift(null)}>取消</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "15px", marginBottom: "2px" }}>{g.name}</div>
                      <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted }}>{g.desc && <span>{g.desc}　</span>}庫存 <span style={{ color: g.stock<=0?C.red:C.green, fontWeight: "600" }}>{g.stock}</span></div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button style={S.btnOutline} onClick={() => setEditGift({...g})}>編輯</button>
                      <button style={{ ...S.btnOutline, borderColor: C.red, color: C.red }} onClick={() => save(async () => { const newGifts = gifts.filter(x=>x.id!==g.id); setGifts(newGifts); await onSaveGifts(newGifts); })}>刪除</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {showNewGift ? (
              <div style={S.card}>
                {[["name","贈品名稱","text"],["desc","說明（選填）","text"],["stock","庫存數量","number"]].map(([k,label,type]) => (
                  <div key={k} style={{ marginBottom: "10px" }}>
                    <label style={S.label}>{label}</label>
                    <input type={type} style={S.input} value={newGift[k]??""} onChange={e => setNewGift(v=>({...v,[k]:e.target.value}))} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{ ...S.btnRose, width: "auto", padding: "8px 20px" }} onClick={() => {
                    if (!newGift.name.trim()||!newGift.stock) return;
                    save(async () => {
                      const newGifts = [...gifts, {...newGift, id: Date.now(), stock: Number(newGift.stock)}];
                      setGifts(newGifts); await onSaveGifts(newGifts);
                      setNewGift({name:"",desc:"",stock:""}); setShowNewGift(false);
                    });
                  }}>新增</button>
                  <button style={S.btnOutline} onClick={() => setShowNewGift(false)}>取消</button>
                </div>
              </div>
            ) : (
              <button style={{ ...S.btnOutline, width: "100%", padding: "12px", borderStyle: "dashed" }} onClick={() => setShowNewGift(true)}>＋ 新增贈品</button>
            )}
          </>
        )}

        {tab === "groups" && (
          <GroupsTab settings={settings} setSettings={setSettings} onSaveSettings={onSaveSettings} products={products} gifts={gifts} />
        )}

        {tab === "settings" && (
          <>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "14px" }}>📢 訂購頁公告</div>
              <textarea style={{ ...S.input, height: "90px", resize: "vertical" }} value={openInfo||""} onChange={e => setSettings(v=>({...v,openInfo:e.target.value}))} placeholder="例：6/29（六）大安市集　12:00–17:00" />
              <button style={{ ...S.btnRose, marginTop: "10px" }} onClick={() => { setSettings(v => { const ns={...v}; save(()=>onSaveSettings(ns)); return ns; }); }}>儲存</button>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "6px" }}>🌸 訂購成功提醒</div>
              <textarea style={{ ...S.input, height: "120px", resize: "vertical", lineHeight: "1.8" }} value={successNote||""} onChange={e => setSettings(v=>({...v,successNote:e.target.value}))} placeholder="例：請留意我們的 LINE 通知…" />
              <button style={{ ...S.btnRose, marginTop: "10px" }} onClick={() => { setSettings(v => { const ns={...v}; save(()=>onSaveSettings(ns)); return ns; }); }}>儲存</button>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "6px" }}>📋 訂購須知</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.muted, marginBottom: "10px" }}>留空則不顯示。</div>
              <textarea style={{ ...S.input, height: "180px", resize: "vertical", lineHeight: "1.8" }} value={noticeText||""} onChange={e => setSettings(v=>({...v,noticeText:e.target.value}))} placeholder="輸入訂購須知內容…" />
              <button style={{ ...S.btnRose, marginTop: "10px" }} onClick={() => { setSettings(v => { const ns={...v}; save(()=>onSaveSettings(ns)); return ns; }); }}>儲存</button>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "10px" }}>✨ 品牌特色</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.muted, marginBottom: "10px" }}>顯示於首頁，可換行。</div>
              <textarea style={{ ...S.input, height: "120px", resize: "vertical", lineHeight: "1.8" }} value={settings.brandFeature || ""} onChange={e => setSettings(v => ({ ...v, brandFeature: e.target.value }))} placeholder="例：🍰 每週限量手工製作&#10;🌸 使用天然食材，無添加防腐劑&#10;💝 每份甜點都是用心製作" />
              <button style={{ ...S.btnRose, marginTop: "10px" }} onClick={() => { setSettings(v => { const ns={...v}; save(()=>onSaveSettings(ns)); return ns; }); }}>儲存</button>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "10px" }}>🍽 食用方式與保存方式</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.muted, marginBottom: "10px" }}>顯示於訂購完成頁，可換行。</div>
              <textarea style={{ ...S.input, height: "150px", resize: "vertical", lineHeight: "1.8" }} value={settings.eatGuide || ""} onChange={e => setSettings(v => ({ ...v, eatGuide: e.target.value }))} placeholder="例：&#10;🍽 食用方式：建議於常溫下回溫10分鐘後享用&#10;🧊 保存方式：請冷藏保存，建議2天內食用完畢" />
              <button style={{ ...S.btnRose, marginTop: "10px" }} onClick={() => { setSettings(v => { const ns={...v}; save(()=>onSaveSettings(ns)); return ns; }); }}>儲存</button>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "10px" }}>📅 取貨日期</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.muted, marginBottom: "10px" }}>客人下單頁面會顯示此日期（唯讀）。</div>
              <input type="text" style={S.input} value={settings.pickupDate || ""} onChange={e => setSettings(v => ({ ...v, pickupDate: e.target.value }))} placeholder="例：6/25（四）" />
              <button style={{ ...S.btnRose, marginTop: "10px" }} onClick={() => { setSettings(v => { const ns={...v}; save(()=>onSaveSettings(ns)); return ns; }); }}>儲存</button>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "14px" }}>⏰ 取貨時段</div>
              {(pickupSlots||[]).map((s,i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ flex: 1, fontFamily: "sans-serif", fontSize: "14px", padding: "8px 12px", background: C.rosePale, borderRadius: "4px", border: `1px solid ${C.border}` }}>{s}</div>
                  <button style={{ ...S.btnOutline, borderColor: C.red, color: C.red, padding: "6px 10px" }} onClick={() => { const newSlots=(pickupSlots||[]).filter((_,j)=>j!==i); setSettings(v=>({...v,pickupSlots:newSlots})); save(()=>onSaveSettings({...settings,pickupSlots:newSlots})); }}>刪除</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <input style={{ ...S.input, flex: 1 }} placeholder="例：16:00" value={newSlot} onChange={e => setNewSlot(e.target.value)} onKeyDown={e => { if (e.key==="Enter"&&newSlot.trim()) { const newSlots=[...(pickupSlots||[]),newSlot.trim()]; setSettings(v=>({...v,pickupSlots:newSlots})); save(()=>onSaveSettings({...settings,pickupSlots:newSlots})); setNewSlot(""); }}} />
                <button style={{ ...S.btnRose, width: "auto", padding: "10px 16px" }} onClick={() => { if (!newSlot.trim()) return; const newSlots=[...(pickupSlots||[]),newSlot.trim()]; setSettings(v=>({...v,pickupSlots:newSlots})); save(()=>onSaveSettings({...settings,pickupSlots:newSlots})); setNewSlot(""); }}>新增</button>
              </div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "14px" }}>📍 取貨地點</div>
              {(pickupLocations||[]).map((l,i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ flex: 1, fontFamily: "sans-serif", fontSize: "14px", padding: "8px 12px", background: C.rosePale, borderRadius: "4px", border: `1px solid ${C.border}` }}>{l}</div>
                  <button style={{ ...S.btnOutline, borderColor: C.red, color: C.red, padding: "6px 10px" }} onClick={() => { const newLocs=(pickupLocations||[]).filter((_,j)=>j!==i); setSettings(v=>({...v,pickupLocations:newLocs})); save(()=>onSaveSettings({...settings,pickupLocations:newLocs})); }}>刪除</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <input style={{ ...S.input, flex: 1 }} placeholder="例：大安市集" value={newLocation} onChange={e => setNewLocation(e.target.value)} onKeyDown={e => { if (e.key==="Enter"&&newLocation.trim()) { const newLocs=[...(pickupLocations||[]),newLocation.trim()]; setSettings(v=>({...v,pickupLocations:newLocs})); save(()=>onSaveSettings({...settings,pickupLocations:newLocs})); setNewLocation(""); }}} />
                <button style={{ ...S.btnRose, width: "auto", padding: "10px 16px" }} onClick={() => { if (!newLocation.trim()) return; const newLocs=[...(pickupLocations||[]),newLocation.trim()]; setSettings(v=>({...v,pickupLocations:newLocs})); save(()=>onSaveSettings({...settings,pickupLocations:newLocs})); setNewLocation(""); }}>新增</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Root ────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({ isOpen: false, openInfo: "", noticeText: "", successNote: "", brandFeature: "", eatGuide: "", storeGuide: "", pickupSlots: ["16:00","16:30","17:00","17:30"], pickupLocations: [], stockGroups: [] });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("order");
  const [pw, setPw] = useState(""); const [pwErr, setPwErr] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, gRes, sRes, oRes] = await Promise.all([
          apiGet("getProducts"), apiGet("getGifts"), apiGet("getSettings"), apiGet("getOrders")
        ]);
        if (pRes.success) setProducts(pRes.products);
        if (gRes.success) setGifts(gRes.gifts);
        if (sRes.success && sRes.settings && Object.keys(sRes.settings).length > 0) {
          const s = sRes.settings;
          // 確保 stockGroups 的 id 和 stock 都是數字
          if (s.stockGroups) s.stockGroups = s.stockGroups.map(g => ({ ...g, id: Number(g.id), stock: Number(g.stock) }));
          setSettings(prev => ({ ...prev, ...s }));
        }
        if (oRes.success) setOrders(oRes.orders || []);
      } catch(e) { console.log("載入失敗", e); }
      setLoading(false);
    }
    load();
  }, []);

  const onSaveProducts = useCallback(async (prods) => { await apiPost({ action: "saveProducts", products: prods }); }, []);
  const onSaveGifts = useCallback(async (gs) => { await apiPost({ action: "saveGifts", gifts: gs }); }, []);
  const onSaveSettings = useCallback(async (s) => { setSettings(s); await apiPost({ action: "saveSettings", settings: s }); }, []);

  if (loading) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: C.muted, fontFamily: "sans-serif" }}>
          <div style={{ fontSize: "30px", marginBottom: "12px" }}>🌸</div>
          <div>載入中…</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {view === "order" && (
        <>
          <OrderPage products={products} gifts={gifts} settings={settings} onSubmit={() => {}} onSaveSettings={onSaveSettings} />
          <button onClick={() => setView("login")} style={{ position: "fixed", bottom: "20px", right: "20px", background: C.ink, color: C.roseMid, border: "none", borderRadius: "50%", width: "44px", height: "44px", fontSize: "18px", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>⚙</button>
        </>
      )}
      {view === "login" && (
        <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ ...S.card, width: "300px" }}>
            <p style={{ color: C.rose, textAlign: "center", marginBottom: "20px", fontSize: "18px", fontFamily: "sans-serif" }}>後台登入</p>
            <label style={S.label}>密碼</label>
            <input type="password" style={{ ...S.input, marginBottom: "12px" }} value={pw} onChange={e => { setPw(e.target.value); setPwErr(false); }} onKeyDown={e => e.key==="Enter"&&(pw===ADMIN_PASSWORD?(setView("admin"),setPw("")):setPwErr(true))} placeholder="輸入後台密碼" />
            {pwErr && <div style={{ padding: "8px 12px", marginBottom: "10px", background: C.redPale, borderRadius: "3px", fontFamily: "sans-serif", fontSize: "12px", color: C.red }}>密碼錯誤</div>}
            <button style={S.btnRose} onClick={() => pw===ADMIN_PASSWORD?(setView("admin"),setPw("")):setPwErr(true)}>進入後台</button>
            <button style={{ ...S.btnOutline, width: "100%", marginTop: "8px" }} onClick={() => { setView("order"); setPw(""); setPwErr(false); }}>返回</button>
          </div>
        </div>
      )}
      {view === "admin" && (
        <>
          <AdminPanel products={products} setProducts={setProducts} gifts={gifts} setGifts={setGifts} orders={orders} setOrders={setOrders} settings={settings} setSettings={setSettings} onSaveProducts={onSaveProducts} onSaveGifts={onSaveGifts} onSaveSettings={onSaveSettings} />
          <button onClick={() => setView("order")} style={{ position: "fixed", bottom: "20px", right: "20px", background: C.ink, color: C.roseMid, border: "none", borderRadius: "50%", width: "44px", height: "44px", fontSize: "18px", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>🛍</button>
        </>
      )}
    </div>
  );
}
