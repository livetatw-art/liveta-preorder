import { useState, useEffect, useRef, useCallback } from "react";

const LOGO_B64 = "https://raw.githubusercontent.com/livetatw-art/liveta-preorder/main/logo.png";
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
function ProductCard({ product, qty, onChange }) {
  const soldOut = product.stock <= 0;
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
        </div>
        <div style={S.tag(soldOut ? C.red : C.green, soldOut ? C.redPale : C.greenPale)}>{soldOut ? "售完" : "供應中"}</div>
      </div>
      {!soldOut && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => onChange(Math.max(0, qty - 1))} style={{ width: "32px", height: "32px", border: `1px solid ${C.border}`, borderRadius: "4px", background: C.cream, cursor: "pointer", fontSize: "18px", color: C.muted }}>−</button>
          <span style={{ fontFamily: "sans-serif", fontSize: "16px", minWidth: "20px", textAlign: "center" }}>{qty}</span>
          <button onClick={() => onChange(Math.min(product.stock, qty + 1))} style={{ width: "32px", height: "32px", border: `1px solid ${C.border}`, borderRadius: "4px", background: C.cream, cursor: "pointer", fontSize: "18px", color: C.ink }}>+</button>
          {qty > 0 && <span style={{ marginLeft: "auto", color: C.rose, fontFamily: "sans-serif", fontSize: "14px" }}>小計 NT$ {product.price * qty}</span>}
        </div>
      )}
    </div>
  );
}

// ── GiftSection ─────────────────────────────────────────────
function GiftSection({ gifts, giftQty, giftCart, onChangeGift }) {
  if (giftQty === 0 || gifts.length === 0) return null;
  const availableGifts = gifts.filter(g => g.stock > 0);
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
                  <button onClick={() => { if (remaining > 0) onChangeGift(g.id, qty + 1); }} style={{ width: "28px", height: "28px", border: `1px solid ${C.border}`, borderRadius: "4px", background: remaining > 0 ? C.cream : "#f0f0f0", cursor: remaining > 0 ? "pointer" : "default", fontSize: "16px", color: remaining > 0 ? C.ink : C.muted }}>+</button>
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
function OrderPage({ products, gifts, settings, onSubmit }) {
  const { isOpen, openInfo, noticeText, successNote, pickupSlots, pickupLocations } = settings;
  const [cart, setCart] = useState({});
  const [giftCart, setGiftCart] = useState({});
  const [form, setForm] = useState({ name: "", phone: "", pickupLocation: "", pickupTime: "", payment: "", note: "", proofFile: null, atmLast5: "" });
  const [submitted, setSubmitted] = useState(false);
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
    if (!form.name.trim()) return setError("請填寫姓名");
    if (!form.phone.trim()) return setError("請填寫電話");
    if (pickupLocations && pickupLocations.length > 0 && !form.pickupLocation) return setError("請選擇取貨地點");
    if (!form.pickupTime) return setError("請選擇取貨時間");
    if (!form.payment) return setError("請選擇付款方式");
    if (form.payment === "line_pay" && !form.proofFile) return setError("請上傳 LINE Pay 付款截圖");
    if (form.payment === "atm" && form.atmLast5.trim().length !== 5) return setError("請填寫匯款末 5 碼");
    if (!hasItems) return setError("請至少選擇一項商品");
    const availableGifts = gifts.filter(g => g.stock > 0);
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
    onSubmit(orderData);
    const itemList = items.map(i => `${i.name} x${i.qty}`).join(", ");
    const giftList = giftItems.length > 0 ? giftItems.map(g => `${g.name} x${g.qty}`).join(", ") : "無";
    const subject = encodeURIComponent(`【莉薇塔新訂單】${ref} - ${form.name}`);
    const body = encodeURIComponent(`訂單編號：${ref}\n姓名：${form.name}\n電話：${form.phone}\n取貨地點：${form.pickupLocation || "未填"}\n取貨時間：${form.pickupTime}\n付款方式：${payLabel(form.payment)}${form.atmLast5 ? `（末5碼：${form.atmLast5}）` : ""}\n\n商品：${itemList}\n贈品：${giftList}\n合計：NT$ ${total}\n\n備註：${form.note || "無"}`);
    window.location.href = `mailto:livetatw@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
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
            <div style={{ color: C.muted, fontFamily: "sans-serif", fontSize: "13px", lineHeight: "1.9" }}>{openInfo || "請關注我們的 LINE 社群，開單時間將另行公告"}</div>
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
            <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.ink, lineHeight: "1.8" }}>{openInfo}</div>
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
          {desserts.map(p => <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onChange={qty => setCart(c => ({ ...c, [p.id]: qty }))} />)}
        </>}
        {drinks.length > 0 && <>
          <div style={{ marginBottom: "16px", marginTop: "8px" }}>
            <div style={{ fontSize: "11px", fontFamily: "sans-serif", color: C.muted, letterSpacing: "0.15em", marginBottom: "4px" }}>DRINKS</div>
            <div style={{ fontSize: "18px" }}>🧋 飲品</div>
          </div>
          {drinks.map(p => <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onChange={qty => setCart(c => ({ ...c, [p.id]: qty }))} />)}
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
        <GiftSection gifts={gifts} giftQty={giftQty} giftCart={giftCart} onChangeGift={(id, qty) => setGiftCart(c => ({ ...c, [id]: qty }))} />
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
              <div style={{ fontFamily: "sans-serif", fontSize: "11px", color: C.muted, marginTop: "6px" }}>請於當日 23:59 前完成匯款並填寫末 5 碼</div>
            </div>
          )}
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label style={S.label}>備註（選填）</label>
          <textarea style={{ ...S.input, height: "72px", resize: "vertical" }} placeholder="過敏、口味偏好、其他需求…" value={form.note} onChange={e => setForm(v => ({ ...v, note: e.target.value }))} />
        </div>
        {error && <div style={{ padding: "10px 14px", marginBottom: "14px", background: C.redPale, border: "1px solid #e0b0b0", borderRadius: "4px", fontFamily: "sans-serif", fontSize: "13px", color: C.red }}>{error}</div>}
        <button style={S.btnRose} onClick={handleSubmit}>確認送出訂單</button>
        <p style={{ textAlign: "center", color: C.muted, fontSize: "11px", fontFamily: "sans-serif", marginTop: "12px", letterSpacing: "0.05em" }}>手工製作・限量預購・感謝您的等待</p>
      </div>
    </div>
  );
}

// ── AdminPanel ──────────────────────────────────────────────
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
        {[["orders","📋 訂單"],["products","🍰 品項"],["gifts","🎁 贈品"],["settings","⚙️ 設定"]].map(([key,label]) => (
          <button key={key} style={tabStyle(tab===key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "20px 16px" }}>

        {tab === "orders" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ fontFamily: "sans-serif", fontSize: "13px", color: C.muted }}>共 {orders.length} 筆</div>
              <button style={{ ...S.btnOutline, borderColor: C.rose, color: C.rose }} onClick={exportCSV}>匯出 CSV</button>
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
                  {o.pickupLocation && <span>📍 {o.pickupLocation}　</span>}⏰ {o.pickupTime}　💳 {payLabel(o.payment)}
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
                        const newOrders = orders.map(x => x.ref===o.ref ? {...x,status:s} : x);
                        setOrders(newOrders);
                        await apiPost({ action: "updateOrderStatus", ref: o.ref, status: s });
                      }} style={{ padding:"4px 8px", border:`1px solid ${o.status===s?C.rose:C.border}`, borderRadius:"3px", background:o.status===s?C.rosePale:"transparent", color:o.status===s?C.rose:C.muted, fontFamily:"sans-serif", fontSize:"11px", cursor:"pointer" }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "products" && (
          <>
            {products.map(p => (
              <div key={p.id} style={S.card}>
                {editProduct?.id === p.id ? (
                  <div>
                    {[["name","品項名稱","text"],["price","售價","number"],["originalPrice","原價（選填，填了才顯示劃線原價）","number"],["stock","庫存數量","number"],["unit","單位","text"]].map(([k,label,type]) => (
                      <div key={k} style={{ marginBottom: "10px" }}>
                        <label style={S.label}>{label}</label>
                        <input type={type} style={S.input} value={editProduct[k]??""} onChange={e => setEditProduct(v=>({...v,[k]:(k==="price"||k==="stock"||k==="originalPrice")?(e.target.value===""?null:Number(e.target.value)):e.target.value}))} />
                      </div>
                    ))}
                    {typeToggle(editProduct, setEditProduct)}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button style={{ ...S.btnRose, width: "auto", padding: "8px 20px" }} onClick={() => save(async () => { const newProds = products.map(x=>x.id===editProduct.id?editProduct:x); setProducts(newProds); await onSaveProducts(newProds); setEditProduct(null); })}>儲存</button>
                      <button style={S.btnOutline} onClick={() => setEditProduct(null)}>取消</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
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
                    <input type={type} style={S.input} value={newProduct[k]??""} onChange={e => setNewProduct(v=>({...v,[k]:e.target.value}))} />
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

        {tab === "settings" && (
          <>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "14px" }}>📢 訂購頁公告</div>
              <textarea style={{ ...S.input, height: "90px", resize: "vertical" }} value={openInfo||""} onChange={e => setSettings(v=>({...v,openInfo:e.target.value}))} placeholder="例：6/29（六）大安市集　12:00–17:00" />
              <button style={{ ...S.btnRose, marginTop: "10px" }} onClick={() => save(() => onSaveSettings(settings))}>儲存</button>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "6px" }}>🌸 訂購成功提醒</div>
              <textarea style={{ ...S.input, height: "120px", resize: "vertical", lineHeight: "1.8" }} value={successNote||""} onChange={e => setSettings(v=>({...v,successNote:e.target.value}))} placeholder="例：請留意我們的 LINE 通知…" />
              <button style={{ ...S.btnRose, marginTop: "10px" }} onClick={() => save(() => onSaveSettings(settings))}>儲存</button>
            </div>
            <div style={S.card}>
              <div style={{ fontSize: "15px", marginBottom: "6px" }}>📋 訂購須知</div>
              <div style={{ fontFamily: "sans-serif", fontSize: "12px", color: C.muted, marginBottom: "10px" }}>留空則不顯示。</div>
              <textarea style={{ ...S.input, height: "180px", resize: "vertical", lineHeight: "1.8" }} value={noticeText||""} onChange={e => setSettings(v=>({...v,noticeText:e.target.value}))} placeholder="輸入訂購須知內容…" />
              <button style={{ ...S.btnRose, marginTop: "10px" }} onClick={() => save(() => onSaveSettings(settings))}>儲存</button>
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
  const [settings, setSettings] = useState({ isOpen: false, openInfo: "", noticeText: "", successNote: "", pickupSlots: ["16:00","16:30","17:00","17:30"], pickupLocations: [] });
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
        if (sRes.success && sRes.settings && Object.keys(sRes.settings).length > 0) setSettings(s => ({ ...s, ...sRes.settings }));
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
          <OrderPage products={products} gifts={gifts} settings={settings} onSubmit={() => {}} />
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
