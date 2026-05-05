import { useState, useRef } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Sarabun',sans-serif;background:#f0f4f8;}
.fade{animation:fadeIn .35s ease both;}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.card{background:#fff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.07);padding:24px;margin-bottom:20px;}
label{display:block;font-size:13px;color:#475569;margin-bottom:4px;font-weight:500;}
input[type=text],input[type=date],input[type=time],input[type=number],select,textarea{
  width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;
  font-family:'Sarabun',sans-serif;font-size:14px;color:#1e293b;outline:none;
  transition:border .2s;background:#fafbfc;}
input:focus,select:focus,textarea:focus{border-color:#2563eb;background:#fff;}
textarea{resize:vertical;min-height:60px;}
.btn{padding:9px 20px;border-radius:10px;font-family:'Sarabun',sans-serif;font-size:14px;font-weight:600;cursor:pointer;border:none;transition:all .2s;}
.btn-primary{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(37,99,235,.4);}
.btn-secondary{background:#f1f5f9;color:#475569;}
.btn-success{background:linear-gradient(135deg,#059669,#047857);color:#fff;}
.btn-danger{background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}
.g4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;}
.rg{display:flex;gap:14px;flex-wrap:wrap;}
.rg label{display:flex;align-items:center;gap:6px;font-weight:400;cursor:pointer;margin:0;font-size:13px;}
.rg input{width:auto;}
.chip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;}
.chip-blue{background:#dbeafe;color:#1d4ed8;}.chip-red{background:#fee2e2;color:#b91c1c;}
.chip-green{background:#d1fae5;color:#065f46;}.chip-yellow{background:#fef9c3;color:#854d0e;}
.nav-tab{padding:9px 16px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;border:none;font-family:'Sarabun',sans-serif;transition:all .2s;}
.nav-tab.active{background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;box-shadow:0 4px 12px rgba(37,99,235,.35);}
.nav-tab:not(.active){background:#fff;color:#64748b;border:1.5px solid #e2e8f0;}
.kpi{background:#fff;border-radius:14px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,.06);text-align:center;}
.kpi-val{font-size:30px;font-weight:800;line-height:1.1;}.kpi-label{font-size:12px;color:#64748b;margin-top:4px;}
.tw{overflow-x:auto;border-radius:12px;border:1.5px solid #e2e8f0;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th{background:#f8fafc;padding:9px 13px;text-align:left;color:#475569;font-weight:600;border-bottom:1.5px solid #e2e8f0;}
td{padding:9px 13px;border-bottom:1px solid #f1f5f9;color:#334155;}
tr:last-child td{border-bottom:none;}tr:hover td{background:#f8fafc;}
.mo{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;}
.md{background:#fff;border-radius:20px;width:100%;max-width:500px;padding:26px;box-shadow:0 20px 60px rgba(0,0,0,.2);}
.sc{background:#f8fafc;border-radius:12px;padding:16px;border:1.5px solid #e2e8f0;margin-bottom:14px;}
.ck-tag{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border-radius:20px;border:1.5px solid #e2e8f0;cursor:pointer;font-size:13px;margin:3px;transition:all .15s;background:#fff;user-select:none;}
.ck-tag.on{background:#dbeafe;border-color:#93c5fd;color:#1d4ed8;font-weight:600;}
.ck-tag:hover{border-color:#93c5fd;}
.ms-wrap{border:1.5px solid #e2e8f0;border-radius:8px;padding:6px 8px;background:#fafbfc;min-height:42px;display:flex;flex-wrap:wrap;gap:4px;cursor:pointer;align-items:center;}
.ms-wrap:focus-within{border-color:#2563eb;background:#fff;}
.ms-tag{background:#dbeafe;color:#1d4ed8;border-radius:14px;padding:2px 10px;font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px;}
.ms-tag button{cursor:pointer;opacity:.6;background:none;border:none;color:inherit;font-size:12px;padding:0;line-height:1;}
.ms-tag button:hover{opacity:1;}
.ms-drop{border:1.5px solid #e2e8f0;border-radius:8px;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.1);z-index:50;max-height:220px;overflow-y:auto;}
.ms-opt{padding:8px 12px;font-size:13px;cursor:pointer;display:flex;align-items:center;gap:8px;}
.ms-opt:hover{background:#eff6ff;}.ms-opt.sel{background:#dbeafe;color:#1d4ed8;font-weight:600;}
`;

const HOSPITALS = ["ท่าหลวง","ชัยบาดาล","บ้านหมี่","โคกสำโรง","พระนารายณ์","มะเร็ง"];
const RIGHTS = ["บัตรทอง","ประกันสังคม","ข้าราชการ","อปท.","สิทธิ์ว่าง"];
const POSITIONS = ["พยาบาลวิชาชีพ","นักวิชาการสาธารณสุข","ทันตสาธารณสุข"];

const WOUND_AROUND_OPTS = ["ปกติ ไม่มีสิ่งผิดปกติ","แดง (Redness)","บวม (Swelling)","มีสิ่งคัดหลั่งใส","มีสิ่งคัดหลั่งขุ่น/หนอง","มีเลือดออก","มีสะเก็ด/ตกสะเก็ด","มีกลิ่นเหม็น","เนื้อตาย (Necrosis)","แผลแยก (Dehiscence)"];
const RESP_SYMS = ["ไอมีเสมหะ","เสมหะสีเหลือง/เขียว","มีไข้","หายใจเหนื่อย","หายใจมีเสียงวี้ด","SpO₂ < 95%","หายใจเร็ว > 20 ครั้ง/นาที","แน่นหน้าอก","ปอดมีเสียงผิดปกติ","ไม่มีอาการผิดปกติ"];
const URINE_SYMS = ["ปัสสาวะขุ่น","ปัสสาวะมีตะกอน","ปัสสาวะมีกลิ่นเหม็น","ปัสสาวะสีผิดปกติ","ปัสสาวะแสบขัด","ปวดท้องน้อย","มีไข้สูง","หนาวสั่น","ไม่มีอาการผิดปกติ"];
const BODY_PARTS = ["ศีรษะ/หนังศีรษะ","หน้าผาก","แก้ม/หู","คอ","หน้าอก","หลัง","ท้อง","กระเบนเหน็บ","สะโพก/ก้น","ต้นขา","เข่า","แข้ง/หน้าแข้ง","ส้นเท้า","เท้า/นิ้วเท้า","แขน/ข้อศอก","มือ/นิ้วมือ","แผลผ่าตัด"];
const WOUND_ADVICE = ["ทำความสะอาดแผลด้วย NSS วันละ 1-2 ครั้ง","เปลี่ยน Dressing ทุกวัน","เปลี่ยน Dressing วันเว้นวัน","เปลี่ยน Dressing เมื่อแผลเปียก/สกปรก","ใช้ยาฆ่าเชื้อทาแผลตามแผนการรักษา","หลีกเลี่ยงการแกะหรือเกาบริเวณแผล","ดูแลให้แผลแห้งอยู่เสมอ","ควบคุมระดับน้ำตาลในเลือด","ดูแลโภชนาการให้เพียงพอ","นัดติดตามที่ รพ.สต. ตามนัด","ส่งต่อโรงพยาบาลหากแผลแย่ลง"];
const SSI_SYMS = ["ปวด บวม แดง ร้อนบริเวณแผล","มีหนองหรือสิ่งคัดหลั่งผิดปกติ","มีไข้สูง > 38°C","แผลแยก (Dehiscence)","มีกลิ่นเหม็นจากแผล","ไม่มีอาการผิดปกติ"];
const SSI_NOTES = ["ควบคุมระดับน้ำตาล","งดสูบบุหรี่","ดูแลโภชนาการ","ทำแผลสะอาด","ส่งต่อหากแผลแย่ลง","ใช้ยาตามแพทย์สั่ง"];
const PROC_RISKS = ["มีไข้หลังทำหัตถการ","บวมแดงบริเวณรอยเข็ม","มีหนอง/สิ่งคัดหลั่งผิดปกติ","มีเลือดออกผิดปกติ","ปวดผิดปกติ","ไม่มีอาการผิดปกติ","ผู้ป่วยภูมิคุ้มกันต่ำ","เบาหวานควบคุมไม่ได้","แพ้ยา/วัสดุที่ใช้"];
const COMMUNITY_DISEASES = [
  {name:"ไข้เลือดออก (DHF)",measures:["กำจัดแหล่งเพาะพันธุ์ยุง","พ่นหมอกควันในพื้นที่","ให้ความรู้ประชาชน","รายงาน สสจ./สสอ.","ติดตามผู้ป่วยในครัวเรือนใกล้เคียง"]},
  {name:"มือเท้าปาก (HFMD)",measures:["แยกเด็กป่วยออกจากเด็กปกติ","ทำความสะอาดของเล่น/สถานที่","ให้ความรู้ผู้ปกครอง","แจ้งศูนย์เด็กเล็ก/โรงเรียน","รายงาน สสจ."]},
  {name:"โควิด-19 (COVID-19)",measures:["แยกกักตัวผู้ป่วย 10 วัน","ค้นหาผู้สัมผัสใกล้ชิด","ATK ผู้สัมผัส","ให้ความรู้การป้องกัน","รายงานระบบ JHCIS"]},
  {name:"ไข้หวัดใหญ่ (Influenza)",measures:["แนะนำฉีดวัคซีน","หยุดพักที่บ้านขณะป่วย","สวมหน้ากากอนามัย","ล้างมือบ่อยครั้ง","ให้ยา Oseltamivir ตามข้อบ่งชี้"]},
  {name:"อุจจาระร่วง/อาหารเป็นพิษ",measures:["สอบสวนแหล่งอาหาร","เก็บตัวอย่างส่งตรวจ","แนะนำสุขวิทยาการประกอบอาหาร","ให้สารน้ำทดแทน","รายงาน สสจ. กรณีระบาด"]},
  {name:"โรคพิษสุนัขบ้า",measures:["ฉีดวัคซีนป้องกันพิษสุนัขบ้า","กักสุนัข/แมวที่กัด 10 วัน","รายงานสัตวแพทย์","ประสาน ปศุสัตว์อำเภอ","ให้ความรู้การดูแลบาดแผล"]},
  {name:"อื่นๆ",measures:["ให้ความรู้ประชาชน","รายงานหน่วยงานที่เกี่ยวข้อง","ติดตามอาการผู้ป่วย","ประสานสาธารณสุขอำเภอ","มาตรการเพิ่มเติมตามชนิดโรค"]},
];

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
function CheckTags({ options, value = [], onChange }) {
  const toggle = v => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {options.map(o => (
        <span key={o} className={`ck-tag${value.includes(o) ? " on" : ""}`} onClick={() => toggle(o)}>
          {value.includes(o) ? "✓" : "+"} {o}
        </span>
      ))}
    </div>
  );
}

function MultiSelect({ options, value = [], onChange, placeholder = "-- เลือกได้หลายรายการ --" }) {
  const [open, setOpen] = useState(false);
  const toggle = v => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  return (
    <div style={{ position: "relative" }}>
      <div className="ms-wrap" onClick={() => setOpen(o => !o)}>
        {value.length === 0 && <span style={{ color: "#94a3b8", fontSize: 13, padding: "2px 4px", flex: 1 }}>{placeholder}</span>}
        {value.map(v => (
          <span key={v} className="ms-tag">{v}
            <button onClick={e => { e.stopPropagation(); toggle(v); }}>✕</button>
          </span>
        ))}
        <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: 11, paddingLeft: 4 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="ms-drop" style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 60 }}>
          {options.map(o => (
            <div key={o} className={`ms-opt${value.includes(o) ? " sel" : ""}`} onClick={() => toggle(o)}>
              <span>{value.includes(o) ? "☑" : "☐"}</span>{o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ num, title, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", borderRadius: 12, padding: "11px 16px", marginBottom: 18, border: "1.5px solid #bfdbfe" }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div><div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>ส่วนที่ {num}</div><div style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>{title}</div></div>
    </div>
  );
}

function emptyForm() {
  return {
    fullName: "", age: "", referFrom: "", right: "",
    admitDate: "", admitTime: "", visitDate: "", visitTime: "",
    lastHospital: "", lastHospitalDate: "", lastHospitalTime: "",
    diagnosis: "", hasInfection: "", infectedSystem: "", organism: "",
    onTrach: "", trachType: "", woundAround: [], onOxygen: "", oxygenType: "",
    rr: "", spo2: "", temp: "",
    onNG: "", ngInsertDate: "", ngChangeDate: "", ngFeedPerDay: "", ngFeedPerMeal: "", ngFoodType: "",
    respiratorySymptoms: [],
    urineAbility: "", catheterInsertDate: "", catheterChangeDate: "",
    urineSymptoms: [], urineSymptomDate: "",
    woundStartDate: "", woundAssessDate: "", woundLocation: [], woundCharacter: [],
    woundType: [], woundTypeOther: "", woundRisk: [], woundAdvice: [], woundNextDate: "", woundNextHospital: [],
    surgeryType: [], surgeryDetail: "", surgeryDate: "", surgeryHospital: "",
    ssiRisk: [], ssiDressing: [], ssiDressingDate: "", ssiSymptoms: [], ssiNotes: [],
    mdroOrganism: [], mdroStatus: "",
    tbStatus: "", tbCaseType: "", tbContactCount: "", tbSmear: "",
    communityDiseases: [],
    summaryInfection: "", recorderName: "", recorderPosition: "", recordDate: "",
  };
}

const MOCK = [
  // ม.ค.
  { id:101,fullName:"นาย ประสิทธิ์ แก้วมณี",age:68,right:"บัตรทอง",visitDate:"2025-01-05",hasInfection:"มี",organism:"E. coli",summaryInfection:"ติดเชื้อจากชุมชน",infectedSystem:"ระบบทางเดินปัสสาวะ",right:"บัตรทอง"},
  { id:102,fullName:"นาง สมศรี ดีใจ",age:55,right:"บัตรทอง",visitDate:"2025-01-10",hasInfection:"ไม่มี",organism:"",summaryInfection:"ไม่พบการติดเชื้อ",infectedSystem:""},
  { id:103,fullName:"นาย ชัย วงศ์ดี",age:72,right:"ข้าราชการ",visitDate:"2025-01-18",hasInfection:"ไม่มี",organism:"",summaryInfection:"ไม่พบการติดเชื้อ",infectedSystem:""},
  // ก.พ.
  { id:201,fullName:"นาง วิไล สุขสม",age:60,right:"บัตรทอง",visitDate:"2025-02-03",hasInfection:"มี",organism:"Klebsiella",summaryInfection:"ติดเชื้อจากโรงพยาบาล",infectedSystem:"ระบบทางเดินหายใจ"},
  { id:202,fullName:"นาย สมพร ใจดี",age:45,right:"ประกันสังคม",visitDate:"2025-02-11",hasInfection:"ไม่มี",organism:"",summaryInfection:"ไม่พบการติดเชื้อ",infectedSystem:""},
  { id:203,fullName:"นาง มณี แสงทอง",age:63,right:"บัตรทอง",visitDate:"2025-02-20",hasInfection:"มี",organism:"S. aureus",summaryInfection:"ติดเชื้อจากชุมชน",infectedSystem:"แผลเรื้อรัง"},
  { id:204,fullName:"นาย สุรินทร์ ทองดี",age:58,right:"อปท.",visitDate:"2025-02-25",hasInfection:"ไม่มี",organism:"",summaryInfection:"ไม่พบการติดเชื้อ",infectedSystem:""},
  // มี.ค.
  { id:301,fullName:"นาง ลำดวน เจริญสุข",age:70,right:"บัตรทอง",visitDate:"2025-03-07",hasInfection:"มี",organism:"P. aeruginosa",summaryInfection:"ติดเชื้อจากโรงพยาบาล",infectedSystem:"ระบบทางเดินหายใจ"},
  { id:302,fullName:"นาย บุญมี ศรีสุข",age:55,right:"บัตรทอง",visitDate:"2025-03-14",hasInfection:"ไม่มี",organism:"",summaryInfection:"ไม่พบการติดเชื้อ",infectedSystem:""},
  { id:303,fullName:"นาง นงนุช พิมพ์ดี",age:48,right:"ประกันสังคม",visitDate:"2025-03-21",hasInfection:"มี",organism:"E. coli",summaryInfection:"ติดเชื้อจากชุมชน",infectedSystem:"ระบบทางเดินปัสสาวะ"},
  { id:304,fullName:"นาย ทองใส แสนดี",age:65,right:"บัตรทอง",visitDate:"2025-03-28",hasInfection:"ไม่มี",organism:"",summaryInfection:"ไม่พบการติดเชื้อ",infectedSystem:""},
  // เม.ย.
  { id:401,fullName:"นาง สำลี ทองมา",age:73,right:"บัตรทอง",visitDate:"2025-04-04",hasInfection:"มี",organism:"MRSA",summaryInfection:"ติดเชื้อจากโรงพยาบาล",infectedSystem:"แผลผ่าตัด"},
  { id:402,fullName:"นาย วิเชียร สุขสบาย",age:50,right:"ข้าราชการ",visitDate:"2025-04-10",hasInfection:"ไม่มี",organism:"",summaryInfection:"ไม่พบการติดเชื้อ",infectedSystem:""},
  { id:403,fullName:"นาง พิมพ์ใจ ดวงดี",age:62,right:"บัตรทอง",visitDate:"2025-04-17",hasInfection:"มี",organism:"Klebsiella",summaryInfection:"ติดเชื้อจากโรงพยาบาล",infectedSystem:"ระบบทางเดินปัสสาวะ"},
  { id:404,fullName:"นาย สมาน พงษ์ดี",age:44,right:"ประกันสังคม",visitDate:"2025-04-24",hasInfection:"มี",organism:"Candida",summaryInfection:"ติดเชื้อจากโรงพยาบาล",infectedSystem:"ระบบทางเดินปัสสาวะ"},
  { id:405,fullName:"นาง ดวงเดือน สีดา",age:67,right:"บัตรทอง",visitDate:"2025-04-28",hasInfection:"ไม่มี",organism:"",summaryInfection:"ไม่พบการติดเชื้อ",infectedSystem:""},
  // พ.ค.
  { id: 1, fullName: "นาย สมชาย ใจดี", age: 62, right: "บัตรทอง", visitDate: "2025-05-01", hasInfection: "มี", organism: "E. coli", summaryInfection: "ติดเชื้อจากชุมชน", infectedSystem: "ระบบทางเดินปัสสาวะ" },
  { id: 2, fullName: "นาง มาลี สุขใส", age: 45, right: "ประกันสังคม", visitDate: "2025-05-02", hasInfection: "ไม่มี", organism: "", summaryInfection: "ไม่พบการติดเชื้อ", infectedSystem: "" },
  { id: 3, fullName: "นาย วิชัย ทองคำ", age: 71, right: "บัตรทอง", visitDate: "2025-05-03", hasInfection: "มี", organism: "Klebsiella", summaryInfection: "ติดเชื้อจากโรงพยาบาล", infectedSystem: "ระบบทางเดินหายใจ" },
  { id: 4, fullName: "นาง สุนีย์ แก้วใส", age: 58, right: "ข้าราชการ", visitDate: "2025-05-03", hasInfection: "มี", organism: "MRSA", summaryInfection: "ติดเชื้อจากโรงพยาบาล", infectedSystem: "แผลผ่าตัด" },
  { id: 5, fullName: "นาง รัตนา ดอกไม้", age: 66, right: "บัตรทอง", visitDate: "2025-05-04", hasInfection: "มี", organism: "P. aeruginosa", summaryInfection: "ติดเชื้อจากโรงพยาบาล", infectedSystem: "ระบบทางเดินหายใจ" },
];

// ─── PRINT VIEW ───────────────────────────────────────────────────────────────
const SECTION_COLORS = [
  {bg:"#1e3a5f",light:"#eff6ff",border:"#bfdbfe",accent:"#2563eb"},  // s1 navy
  {bg:"#0f766e",light:"#f0fdfa",border:"#99f6e4",accent:"#0d9488"},  // s2 teal
  {bg:"#7c3aed",light:"#f5f3ff",border:"#ddd6fe",accent:"#7c3aed"},  // s3 purple
  {bg:"#b45309",light:"#fffbeb",border:"#fde68a",accent:"#d97706"},  // s4 amber
  {bg:"#be123c",light:"#fff1f2",border:"#fecdd3",accent:"#e11d48"},  // s5 rose
  {bg:"#0369a1",light:"#f0f9ff",border:"#bae6fd",accent:"#0284c7"},  // s6 sky
  {bg:"#166534",light:"#f0fdf4",border:"#bbf7d0",accent:"#16a34a"},  // s7 green
  {bg:"#1e293b",light:"#f8fafc",border:"#cbd5e1",accent:"#475569"},  // s8 slate
];

function PrintView({ record: r, onClose }) {
  const ref = useRef();
  const av = v => Array.isArray(v) ? (v.length ? v.join("  |  ") : "-") : (v || "-");

  const printCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Sarabun',sans-serif;font-size:13px;color:#1e293b;background:#fff;padding:18px 22px;}
    /* Header */
    .hdr{text-align:center;padding:14px 20px 12px;background:linear-gradient(135deg,#1e3a5f,#2563eb);border-radius:10px;margin-bottom:16px;}
    .hdr h1{font-size:16px;font-weight:800;color:#fff;margin-bottom:2px;}
    .hdr p{font-size:11px;color:#93c5fd;}
    /* Section block */
    .sec{border-radius:10px;overflow:hidden;margin-bottom:14px;border:1.5px solid #e2e8f0;page-break-inside:avoid;}
    .sec-head{padding:8px 14px;display:flex;align-items:center;gap:8px;}
    .sec-head .num{font-size:10px;font-weight:700;opacity:.8;}
    .sec-head .title{font-size:13px;font-weight:800;color:#fff;}
    .sec-body{padding:12px 14px;}
    /* Q&A rows */
    .qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;}
    .qa-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;}
    .qa-full{grid-column:1/-1;}
    .qa-item{padding:6px 10px;border-bottom:1px solid #f1f5f9;display:flex;flex-direction:column;gap:2px;}
    .qa-item:nth-child(even){background:#fafbfd;}
    .q{font-size:10.5px;color:#64748b;font-weight:500;}
    .a{font-size:13px;font-weight:700;color:#1e293b;min-height:18px;}
    .a.highlight{color:#dc2626;}
    .a.good{color:#059669;}
    /* Vital signs special */
    .vital-row{display:flex;gap:0;border-bottom:1px solid #f1f5f9;}
    .vital-box{flex:1;padding:8px 12px;text-align:center;border-right:1px solid #f1f5f9;}
    .vital-box:last-child{border-right:none;}
    .v-num{font-size:22px;font-weight:800;color:#0369a1;}
    .v-unit{font-size:10px;color:#64748b;}
    .v-label{font-size:10px;color:#64748b;margin-top:2px;}
    /* Procedure table */
    .proc-table{width:100%;border-collapse:collapse;font-size:12px;}
    .proc-table th{background:#f1f5f9;padding:6px 10px;text-align:left;color:#475569;font-weight:600;border-bottom:1.5px solid #e2e8f0;}
    .proc-table td{padding:6px 10px;border-bottom:1px solid #f1f5f9;vertical-align:top;}
    .proc-table tr:last-child td{border-bottom:none;}
    /* Summary */
    .sum-box{display:inline-block;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:800;margin:6px 0;}
    .sum-none{background:#d1fae5;color:#065f46;}
    .sum-com{background:#fef3c7;color:#92400e;}
    .sum-hosp{background:#fee2e2;color:#991b1b;}
    /* Signature */
    .sig-section{margin-top:18px;display:flex;gap:20px;}
    .sig-box{flex:1;border:1.5px solid #cbd5e1;border-radius:10px;overflow:hidden;}
    .sig-head{padding:7px 14px;font-size:11px;font-weight:700;color:#fff;}
    .sig-body{padding:10px 14px;}
    .sig-space{height:56px;border-bottom:1px dashed #cbd5e1;margin-bottom:8px;position:relative;}
    .sig-space::after{content:"ลายเซ็น";position:absolute;bottom:4px;left:50%;transform:translateX(-50%);font-size:9px;color:#cbd5e1;}
    .sig-name{font-size:12px;font-weight:700;text-align:center;color:#1e293b;margin-bottom:2px;}
    .sig-pos{font-size:11px;color:#64748b;text-align:center;}
    .sig-date{font-size:11px;color:#64748b;text-align:center;margin-top:6px;border-top:1px solid #f1f5f9;padding-top:6px;}
    @media print{body{padding:10px 14px;}}
  `;

  const secHead = (num, title, icon) => {
    const c = SECTION_COLORS[num-1];
    return `<div class="sec-head" style="background:${c.bg};">
      <span style="font-size:16px;">${icon}</span>
      <div><div class="num">ส่วนที่ ${num}</div><div class="title">${title}</div></div>
    </div>`;
  };
  const secStyle = (num) => {
    const c = SECTION_COLORS[num-1];
    return `border-color:${c.border};`;
  };
  const bodyStyle = (num) => {
    const c = SECTION_COLORS[num-1];
    return `background:${c.light};`;
  };
  const qa = (q, a, cls="") => `<div class="qa-item"><div class="q">${q}</div><div class="a ${cls}">${a||"-"}</div></div>`;
  const qaFull = (q, a, cls="") => `<div class="qa-item qa-full"><div class="q">${q}</div><div class="a ${cls}">${a||"-"}</div></div>`;

  const buildHTML = () => {
    const a = v => Array.isArray(v) ? (v.length ? v.join(" | ") : "-") : (v||"-");
    let html = "";

    // ── Header
    html += `<div class="hdr">
      <h1>แบบบันทึกการเฝ้าระวังการติดเชื้อในโรงพยาบาล</h1>
      <p>โรงพยาบาลส่งเสริมสุขภาพตำบลแก่งผักกูด  อำเภอท่าหลวง  จังหวัดลพบุรี</p>
    </div>`;

    // ── ส่วน 1
    html += `<div class="sec" style="${secStyle(1)}">
      ${secHead(1,"ข้อมูลทั่วไป","👤")}
      <div class="sec-body" style="${bodyStyle(1)}">
        <div class="qa-grid-3">
          ${qa("ชื่อ-นามสกุล", r.fullName)}
          ${qa("อายุ", r.age?`${r.age} ปี`:"")}
          ${qa("สิทธิการรักษา", r.right)}
          ${qa("ส่งต่อจากโรงพยาบาล", r.referFrom)}
          ${qa("บันทึกเข้าแฟ้ม รพ.สต. วันที่/เวลา", r.admitDate?`${r.admitDate}  ${r.admitTime||""}`:"")}
          ${qa("ติดตามลงเยี่ยมบ้าน วันที่/เวลา", r.visitDate?`${r.visitDate}  ${r.visitTime||""}`:"")}
          ${qa("รักษาตัวล่าสุดที่โรงพยาบาล", r.lastHospital)}
          ${qa("วันที่/เวลา", r.lastHospitalDate?`${r.lastHospitalDate}  ${r.lastHospitalTime||""}`:"")}
          ${qa("ด้วยโรคหรืออาการ", r.diagnosis)}
        </div>
        <div class="qa-grid-3" style="border-top:2px dashed #bfdbfe;margin-top:4px;padding-top:4px;">
          ${qa("ขณะลงเยี่ยมบ้านพบการติดเชื้อ", r.hasInfection, r.hasInfection==="มี"?"highlight":r.hasInfection==="ไม่มี"?"good":"")}
          ${r.hasInfection==="มี" ? qa("การติดเชื้อที่ระบบ/อวัยวะ", r.infectedSystem,"highlight") : "<div></div>"}
          ${r.hasInfection==="มี" ? qa("เชื้อที่พบ", r.organism,"highlight") : "<div></div>"}
        </div>
      </div>
    </div>`;

    // ── ส่วน 2 (show if any data)
    if(r.onTrach||r.onOxygen||r.rr||r.spo2||r.temp||r.onNG||(r.respiratorySymptoms&&r.respiratorySymptoms.length)) {
      html += `<div class="sec" style="${secStyle(2)}">
        ${secHead(2,"ผู้ป่วยเสี่ยงต่อการติดเชื้อระบบทางเดินหายใจ / ปอดอักเสบ","🫁")}
        <div class="sec-body" style="${bodyStyle(2)}">
          <div class="qa-grid-3">
            ${qa("On Tracheostomy Tube", r.onTrach==="ใส่"?`ใส่ — ชนิด: ${r.trachType||"-"}`:r.onTrach)}
            ${qa("รอบแผลมีลักษณะ", a(r.woundAround))}
            ${qa("On Oxygen", r.onOxygen==="ใช้"?`ใช้ — ชนิด: ${r.oxygenType||"-"}`:r.onOxygen)}
          </div>
          ${(r.rr||r.spo2||r.temp)?`
          <div class="vital-row" style="background:#fff;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;margin:6px 0;">
            <div class="vital-box"><div class="v-num">${r.rr||"-"}</div><div class="v-unit">ครั้ง/นาที</div><div class="v-label">อัตราการหายใจ</div></div>
            <div class="vital-box"><div class="v-num" style="color:${r.spo2&&Number(r.spo2)<95?"#dc2626":"#0369a1"}">${r.spo2||"-"}</div><div class="v-unit">%</div><div class="v-label">SpO₂</div></div>
            <div class="vital-box"><div class="v-num" style="color:${r.temp&&Number(r.temp)>=37.5?"#dc2626":"#0369a1"}">${r.temp||"-"}</div><div class="v-unit">°C</div><div class="v-label">อุณหภูมิ</div></div>
          </div>`:""}
          ${r.onNG==="ใส่"?`<div class="qa-grid-3" style="border-top:1px dashed #99f6e4;padding-top:4px;">
            ${qa("On NG Tube","ใส่")}
            ${qa("วันที่ใส่", r.ngInsertDate)}
            ${qa("วันที่ครบเปลี่ยน", r.ngChangeDate)}
            ${qa("จำนวนมื้อ/วัน", r.ngFeedPerDay?`${r.ngFeedPerDay} มื้อ`:"")}
            ${qa("ปริมาณ/มื้อ", r.ngFeedPerMeal?`${r.ngFeedPerMeal} มล.`:"")}
            ${qa("ชนิดอาหาร", r.ngFoodType)}
          </div>`:""}
          ${(r.respiratorySymptoms&&r.respiratorySymptoms.length)?`<div style="padding:6px 10px;border-top:1px dashed #99f6e4;">
            <div class="q">อาการผิดปกติที่เกี่ยวกับระบบทางเดินหายใจ</div>
            <div class="a">${a(r.respiratorySymptoms)}</div>
          </div>`:""}
        </div>
      </div>`;
    }

    // ── ส่วน 3
    if(r.urineAbility||(r.urineSymptoms&&r.urineSymptoms.length)) {
      html += `<div class="sec" style="${secStyle(3)}">
        ${secHead(3,"ผู้ป่วยเสี่ยงต่อการติดเชื้อระบบทางเดินปัสสาวะ","🔬")}
        <div class="sec-body" style="${bodyStyle(3)}">
          <div class="qa-grid-3">
            ${qa("ความสามารถในการปัสสาวะ", r.urineAbility)}
            ${r.urineAbility==="ใส่สายสวนปัสสาวะ"?qa("วันที่ใส่สายสวน", r.catheterInsertDate):"<div></div>"}
            ${r.urineAbility==="ใส่สายสวนปัสสาวะ"?qa("วันที่ครบเปลี่ยน", r.catheterChangeDate):"<div></div>"}
          </div>
          ${(r.urineSymptoms&&r.urineSymptoms.length)||r.urineSymptomDate?`
          <div class="qa-grid" style="border-top:1px dashed #ddd6fe;margin-top:4px;padding-top:4px;">
            ${qaFull("อาการผิดปกติที่เกี่ยวกับระบบทางเดินปัสสาวะ", a(r.urineSymptoms))}
            ${r.urineSymptomDate?qa("วันที่เริ่มมีอาการผิดปกติ", r.urineSymptomDate):""}
          </div>`:""}
        </div>
      </div>`;
    }

    // ── ส่วน 4
    if(r.woundStartDate||(r.woundLocation&&r.woundLocation.length)) {
      html += `<div class="sec" style="${secStyle(4)}">
        ${secHead(4,"ผู้ป่วยเสี่ยงต่อการติดเชื้อแผลเรื้อรัง / แผลกดทับ","🩹")}
        <div class="sec-body" style="${bodyStyle(4)}">
          <div class="qa-grid-3">
            ${qa("วันที่เริ่มมีแผล", r.woundStartDate)}
            ${qa("วันที่ลงประเมิน", r.woundAssessDate)}
            ${qaFull("อวัยวะในร่างกายที่มีแผล", a(r.woundLocation))}
            ${qaFull("ลักษณะบาดแผล", a(r.woundCharacter))}
            ${qa("ชนิดของบาดแผล", [a(r.woundType), r.woundTypeOther].filter(x=>x&&x!=="-").join(" | "))}
            ${qaFull("ข้อบ่งชี้ที่เสี่ยงต่อการติดเชื้อ", a(r.woundRisk))}
            ${qaFull("คำแนะนำในการดูแลบาดแผล", a(r.woundAdvice))}
            ${qa("วันที่นัดดูแผล", r.woundNextDate)}
            ${qa("โรงพยาบาลที่นัดดูแผล", a(r.woundNextHospital))}
          </div>
        </div>
      </div>`;
    }

    // ── ส่วน 5
    if(r.surgeryType&&r.surgeryType.length) {
      html += `<div class="sec" style="${secStyle(5)}">
        ${secHead(5,"ผู้ป่วยเสี่ยงต่อการติดเชื้อที่แผลผ่าตัด (SSI)","🔪")}
        <div class="sec-body" style="${bodyStyle(5)}">
          <div class="qa-grid-3">
            ${qaFull("ประเภทการผ่าตัด", a(r.surgeryType))}
            ${qaFull("รายละเอียดการผ่าตัด", r.surgeryDetail)}
            ${qa("วันที่ผ่าตัด", r.surgeryDate)}
            ${qa("โรงพยาบาลที่ผ่าตัด", r.surgeryHospital)}
            ${qaFull("ปัจจัยเสี่ยง SSI", a(r.ssiRisk))}
            ${qa("ชนิด Dressing", a(r.ssiDressing))}
            ${qa("วันที่ทำ Dressing ล่าสุด", r.ssiDressingDate)}
            ${qaFull("อาการแผลผ่าตัด", a(r.ssiSymptoms))}
            ${qaFull("คำแนะนำ / หมายเหตุ", a(r.ssiNotes))}
          </div>
        </div>
      </div>`;
    }

    // ── ส่วน 6
    if(r.procedures&&r.procedures.length) {
      html += `<div class="sec" style="${secStyle(6)}">
        ${secHead(6,"ผู้ป่วยได้รับการทำหัตถการที่ รพ.สต.","💉")}
        <div class="sec-body" style="${bodyStyle(6)}">
          <table class="proc-table">
            <thead><tr><th>#</th><th>ชนิดหัตถการ</th><th>วันที่</th><th>ผู้ทำหัตถการ</th><th>อาการ/ความเสี่ยงติดเชื้อ</th></tr></thead>
            <tbody>
              ${r.procedures.map((p,i)=>`<tr>
                <td>${i+1}</td>
                <td>${p.name==="อื่นๆ"?`อื่นๆ: ${p.otherDetail||""}`:p.name||"-"}</td>
                <td>${p.date||"-"}</td>
                <td>${p.by||"-"}</td>
                <td>${Array.isArray(p.risks)&&p.risks.length?p.risks.join(" | "):"-"}</td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>`;
    }

    // ── ส่วน 7
    if((r.mdroOrganism&&r.mdroOrganism.length)||r.tbStatus||(r.communityDiseases&&r.communityDiseases.length)) {
      html += `<div class="sec" style="${secStyle(7)}">
        ${secHead(7,"ผู้ป่วยที่ต้องเฝ้าระวังการแพร่กระจายเชื้อในชุมชน","🌍")}
        <div class="sec-body" style="${bodyStyle(7)}">`;
      if(r.mdroOrganism&&r.mdroOrganism.length) {
        html += `<div style="font-size:11px;font-weight:700;color:#166534;margin-bottom:4px;padding:0 4px;">🦠 เชื้อดื้อยา (MDRO)</div>
        <div class="qa-grid" style="margin-bottom:8px;">
          ${qa("ชนิดเชื้อดื้อยา", a(r.mdroOrganism))}
          ${qa("สถานะ", r.mdroStatus)}
        </div>`;
      }
      if(r.tbStatus) {
        html += `<div style="font-size:11px;font-weight:700;color:#166534;margin-bottom:4px;padding:0 4px;">🫁 วัณโรคปอด (TB)</div>
        <div class="qa-grid-3" style="margin-bottom:8px;">
          ${qa("สถานะ", r.tbStatus)}
          ${qa("ประเภทผู้ป่วย", r.tbCaseType)}
          ${qa("ผล Smear", r.tbSmear)}
          ${qa("จำนวนผู้สัมผัสร่วมบ้าน", r.tbContactCount?`${r.tbContactCount} คน`:"-")}
        </div>`;
      }
      if(r.communityDiseases&&r.communityDiseases.length) {
        html += `<div style="font-size:11px;font-weight:700;color:#166534;margin-bottom:6px;padding:0 4px;">🏘️ โรคติดเชื้ออื่นๆ ในชุมชน</div>`;
        r.communityDiseases.forEach(d=>{
          html += `<div style="background:#fff;border-radius:8px;padding:8px 12px;margin-bottom:6px;border:1px solid #bbf7d0;">
            <div style="font-weight:700;color:#166534;font-size:12px;margin-bottom:4px;">${d.disease}</div>
            <div style="font-size:11px;color:#475569;">มาตรการ: ${Array.isArray(d.measures)&&d.measures.length?d.measures.join(" | "):"-"}</div>
          </div>`;
        });
      }
      html += `</div></div>`;
    }

    // ── ส่วน 8
    const sumClass = r.summaryInfection==="ไม่พบการติดเชื้อ"?"sum-none":r.summaryInfection==="ติดเชื้อจากชุมชน"?"sum-com":"sum-hosp";
    html += `<div class="sec" style="${secStyle(8)}">
      ${secHead(8,"สรุปการเฝ้าระวังการติดเชื้อ","📋")}
      <div class="sec-body" style="${bodyStyle(8)}">
        <div style="padding:8px 10px;">
          <div class="q" style="margin-bottom:6px;">ผลการเฝ้าระวัง</div>
          <div class="sum-box ${sumClass}">${r.summaryInfection||"ยังไม่ได้บันทึก"}</div>
        </div>
      </div>
    </div>`;

    // ── Signatures
    html += `<div class="sig-section">
      <div class="sig-box">
        <div class="sig-head" style="background:#1e3a5f;">ผู้บันทึกข้อมูล</div>
        <div class="sig-body">
          <div class="sig-space"></div>
          <div class="sig-name">(${r.recorderName||"............................................"})</div>
          <div class="sig-pos">${r.recorderPosition||"ตำแหน่ง ........................................"}</div>
          <div class="sig-date">วันที่บันทึก  ${r.recordDate||"........ / ........ / ........"}</div>
        </div>
      </div>
      <div class="sig-box">
        <div class="sig-head" style="background:#0f766e;">หัวหน้า รพ.สต. รับทราบ</div>
        <div class="sig-body">
          <div class="sig-space"></div>
          <div class="sig-name">(นางสาวปานรดา  ศิริพันธุ์)</div>
          <div class="sig-pos">หัวหน้าโรงพยาบาลส่งเสริมสุขภาพตำบลแก่งผักกูด</div>
          <div class="sig-date">วันที่  ........ / ........ / ........</div>
        </div>
      </div>
    </div>`;

    return html;
  };

  const doPrint = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><meta charset="utf-8"><title>HAI - ${r.fullName}</title>
      <style>${printCSS}</style></head><body>${buildHTML()}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  };

  // Preview styles (inline for modal)
  const previewCSS = printCSS + `
    .sec{margin-bottom:12px;}
    .qa-grid{display:grid;grid-template-columns:1fr 1fr;}
    .qa-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;}
    .qa-full{grid-column:1/-1;}
  `;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div style={{ background:"#f8fafc",borderRadius:20,width:"100%",maxWidth:820,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column" }}>
        {/* Toolbar */}
        <div style={{ background:"#1e3a5f",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:"20px 20px 0 0" }}>
          <div>
            <div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>🖨️ ตัวอย่างก่อนพิมพ์</div>
            <div style={{ color:"#93c5fd",fontSize:12 }}>{r.fullName} — วันที่เยี่ยม {r.visitDate}</div>
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button className="btn btn-success" onClick={doPrint}>🖨️ พิมพ์ลงกระดาษ A4</button>
            <button className="btn btn-secondary" onClick={onClose}>ปิด</button>
          </div>
        </div>
        {/* Preview */}
        <div style={{ overflow:"auto",padding:"20px",flex:1 }}>
          <style>{previewCSS}</style>
          <div style={{ background:"#fff",borderRadius:12,padding:"20px 22px",boxShadow:"0 4px 20px rgba(0,0,0,.1)",maxWidth:760,margin:"0 auto" }}
            dangerouslySetInnerHTML={{ __html: buildHTML() }} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [records, setRecords] = useState(MOCK);
  const [form, setForm] = useState(emptyForm());
  const [editId, setEditId] = useState(null);
  const [procedures, setProcedures] = useState([]);
  const [printRecord, setPrintRecord] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const arr = v => Array.isArray(v) ? v : [];

  const saveRecord = () => {
    const r = { ...form, procedures, id: editId || Date.now() };
    if (editId) setRecords(p => p.map(x => x.id === editId ? r : x));
    else setRecords(p => [...p, r]);
    setSaved(true);
    setTimeout(() => { setSaved(false); setTab("list"); }, 1200);
  };
  const startNew = () => { setForm(emptyForm()); setProcedures([]); setEditId(null); setTab("form"); };
  const editRec = r => { setForm(r); setProcedures(r.procedures || []); setEditId(r.id); setTab("form"); };
  const delRec = id => { setRecords(p => p.filter(x => x.id !== id)); setDelConfirm(null); };

  const addProc = () => setProcedures(p => [...p, { name: "", otherDetail: "", date: "", by: "", risks: [] }]);
  const setP = (i, k, v) => setProcedures(p => p.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const removeP = i => setProcedures(p => p.filter((_, idx) => idx !== i));

  const toggleDisease = name => {
    const curr = arr(form.communityDiseases);
    if (curr.find(d => d.disease === name)) set("communityDiseases", curr.filter(d => d.disease !== name));
    else set("communityDiseases", [...curr, { disease: name, measures: [] }]);
  };
  const setDiseaseMeasures = (name, measures) =>
    set("communityDiseases", arr(form.communityDiseases).map(d => d.disease === name ? { ...d, measures } : d));

  // ── Monthly summary state ──────────────────────────────────────────────────
  const now = new Date();
  const [selYear, setSelYear] = useState(now.getFullYear());
  const [selMonth, setSelMonth] = useState(now.getMonth() + 1); // 1-12

  const MONTH_NAMES = ["","มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const MONTH_SHORT = ["","ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

  // Filter records for selected month/year
  const monthRecords = records.filter(r => {
    if (!r.visitDate) return false;
    const d = new Date(r.visitDate);
    return d.getFullYear() === selYear && d.getMonth() + 1 === selMonth;
  });

  // Build full-year monthly bar data from actual records
  const buildYearData = (yr) => Array.from({length:12},(_,i)=>{
    const m = i+1;
    const recs = records.filter(r => { if(!r.visitDate) return false; const d=new Date(r.visitDate); return d.getFullYear()===yr && d.getMonth()+1===m; });
    return { month: MONTH_SHORT[m], ไม่ติดเชื้อ: recs.filter(r=>r.summaryInfection==="ไม่พบการติดเชื้อ").length, ติดเชื้อชุมชน: recs.filter(r=>r.summaryInfection==="ติดเชื้อจากชุมชน").length, ติดเชื้อรพ: recs.filter(r=>r.summaryInfection==="ติดเชื้อจากโรงพยาบาล").length, total: recs.length };
  });

  const yearData = buildYearData(selYear);

  // Monthly detail stats
  const mTotal = monthRecords.length;
  const mInfected = monthRecords.filter(r=>r.hasInfection==="มี").length;
  const mCommunity = monthRecords.filter(r=>r.summaryInfection==="ติดเชื้อจากชุมชน").length;
  const mHospital = monthRecords.filter(r=>r.summaryInfection==="ติดเชื้อจากโรงพยาบาล").length;
  const mNone = monthRecords.filter(r=>r.summaryInfection==="ไม่พบการติดเชื้อ").length;
  const mRate = mTotal > 0 ? ((mInfected/mTotal)*100).toFixed(1) : "0.0";
  const mOrgMap = monthRecords.filter(r=>r.organism).reduce((a,r)=>{a[r.organism]=(a[r.organism]||0)+1;return a;},{});
  const mOrgChart = Object.entries(mOrgMap).map(([name,value])=>({name,value}));
  const mSysMap = monthRecords.filter(r=>r.infectedSystem).reduce((a,r)=>{a[r.infectedSystem]=(a[r.infectedSystem]||0)+1;return a;},{});
  const mSysChart = Object.entries(mSysMap).map(([name,value])=>({name,value}));
  const mPieData = [
    {name:"ไม่พบการติดเชื้อ",value:mNone,color:"#10b981"},
    {name:"ติดเชื้อจากชุมชน",value:mCommunity,color:"#f59e0b"},
    {name:"ติดเชื้อจากโรงพยาบาล",value:mHospital,color:"#ef4444"},
  ];

  // Available years from records
  const availYears = [...new Set(records.map(r=>r.visitDate?new Date(r.visitDate).getFullYear():null).filter(Boolean))].sort((a,b)=>b-a);
  if(!availYears.includes(now.getFullYear())) availYears.unshift(now.getFullYear());

  // Dashboard uses all records
  const total = records.length;
  const infected = records.filter(r => r.hasInfection === "มี").length;
  const community = records.filter(r => r.summaryInfection === "ติดเชื้อจากชุมชน").length;
  const hospital = records.filter(r => r.summaryInfection === "ติดเชื้อจากโรงพยาบาล").length;
  const none = records.filter(r => r.summaryInfection === "ไม่พบการติดเชื้อ").length;
  const rate = total > 0 ? ((infected / total) * 100).toFixed(1) : 0;

  const monthlyData = buildYearData(now.getFullYear());
  const pieData = [
    { name: "ไม่พบการติดเชื้อ", value: none, color: "#10b981" },
    { name: "ติดเชื้อจากชุมชน", value: community, color: "#f59e0b" },
    { name: "ติดเชื้อจากโรงพยาบาล", value: hospital, color: "#ef4444" },
  ];
  const sysMap = records.filter(r => r.infectedSystem).reduce((a, r) => { a[r.infectedSystem] = (a[r.infectedSystem] || 0) + 1; return a; }, {});
  const sysChart = Object.entries(sysMap).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      <style>{G}</style>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2563eb)", padding: "16px 20px", boxShadow: "0 4px 20px rgba(37,99,235,.3)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ width: 46, height: 46, background: "rgba(255,255,255,.15)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏥</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>ระบบเฝ้าระวังการติดเชื้อในโรงพยาบาล</div>
              <div style={{ color: "#93c5fd", fontSize: 13 }}>รพ.สต. แก่งผักกูด อ.ท่าหลวง จ.ลพบุรี</div>
            </div>
            <button onClick={startNew} className="btn btn-primary" style={{ marginLeft: "auto", background: "rgba(255,255,255,.2)", border: "1.5px solid rgba(255,255,255,.4)", color: "#fff" }}>+ บันทึกผู้ป่วยใหม่</button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[{ id: "dashboard", label: "📊 แดชบอร์ด" }, { id: "monthly", label: "📅 สรุปรายเดือน" }, { id: "list", label: "📋 รายการผู้ป่วย" }, { id: "form", label: "📝 บันทึก/แก้ไข" }].map(t => (
              <button key={t.id} className={`nav-tab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}
                style={tab !== t.id ? { background: "rgba(255,255,255,.1)", color: "#93c5fd", border: "1.5px solid rgba(255,255,255,.2)" } : {}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 16px" }}>

        {/* ══ DASHBOARD ══ */}
        {tab === "dashboard" && (
          <div className="fade">
            <div className="g4" style={{ marginBottom: 20 }}>
              {[{ val: total, label: "เยี่ยมบ้านทั้งหมด", color: "#2563eb", icon: "👥" }, { val: infected, label: "พบการติดเชื้อ", color: "#ef4444", icon: "🦠" }, { val: `${rate}%`, label: "อัตราการติดเชื้อ", color: "#f59e0b", icon: "📉" }, { val: none, label: "ไม่พบการติดเชื้อ", color: "#10b981", icon: "✅" }].map((k, i) => (
                <div key={i} className="kpi"><div style={{ fontSize: 26, marginBottom: 4 }}>{k.icon}</div><div className="kpi-val" style={{ color: k.color }}>{k.val}</div><div className="kpi-label">{k.label}</div></div>
              ))}
            </div>
            <div className="g2">
              <div className="card">
                <div style={{ fontWeight: 700, color: "#1e3a5f", borderLeft: "4px solid #2563eb", paddingLeft: 10, marginBottom: 14 }}>แนวโน้มรายเดือน</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="ไม่ติดเชื้อ" fill="#10b981" radius={[4, 4, 0, 0]} /><Bar dataKey="ติดเชื้อชุมชน" fill="#f59e0b" radius={[4, 4, 0, 0]} /><Bar dataKey="ติดเชื้อรพ" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <div style={{ fontWeight: 700, color: "#1e3a5f", borderLeft: "4px solid #2563eb", paddingLeft: 10, marginBottom: 14 }}>สัดส่วนการติดเชื้อ</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {sysChart.length > 0 && <div className="card">
              <div style={{ fontWeight: 700, color: "#1e3a5f", borderLeft: "4px solid #2563eb", paddingLeft: 10, marginBottom: 14 }}>การติดเชื้อแยกตามระบบ/อวัยวะ</div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={sysChart} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} /><XAxis type="number" tick={{ fontSize: 12 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={160} /><Tooltip /><Bar dataKey="value" fill="#2563eb" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>}
            <div className="card">
              <div style={{ fontWeight: 700, color: "#1e3a5f", borderLeft: "4px solid #2563eb", paddingLeft: 10, marginBottom: 14 }}>สรุปเชื้อที่พบ</div>
              <div className="tw"><table><thead><tr><th>ชื่อผู้ป่วย</th><th>วันที่เยี่ยม</th><th>เชื้อ</th><th>ระบบ</th><th>สรุป</th></tr></thead>
                <tbody>{records.filter(r => r.hasInfection === "มี").map(r => (
                  <tr key={r.id}><td>{r.fullName}</td><td>{r.visitDate}</td><td><span className="chip chip-red">{r.organism || "-"}</span></td><td>{r.infectedSystem || "-"}</td><td><span className={`chip ${r.summaryInfection === "ติดเชื้อจากโรงพยาบาล" ? "chip-red" : "chip-yellow"}`}>{r.summaryInfection}</span></td></tr>
                ))}{records.filter(r => r.hasInfection === "มี").length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}>ไม่พบเคสติดเชื้อ</td></tr>}</tbody>
              </table></div>
            </div>
          </div>
        )}

        {/* ══ MONTHLY SUMMARY ══ */}
        {tab === "monthly" && (
          <div className="fade">
            {/* Month/Year Selector */}
            <div className="card" style={{padding:"18px 24px",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                <div style={{fontWeight:700,color:"#1e3a5f",fontSize:15}}>📅 สรุปรายเดือน</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto",flexWrap:"wrap"}}>
                  {/* Year */}
                  <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{width:"auto",padding:"7px 12px"}}>
                    {availYears.map(y=><option key={y} value={y}>ปี {y+543} ({y})</option>)}
                  </select>
                  {/* Month buttons */}
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {Array.from({length:12},(_,i)=>i+1).map(m=>(
                      <button key={m} onClick={()=>setSelMonth(m)}
                        style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Sarabun',sans-serif",
                          background: selMonth===m?"linear-gradient(135deg,#2563eb,#1d4ed8)":"#fff",
                          color: selMonth===m?"#fff":"#64748b",
                          borderColor: selMonth===m?"#2563eb":"#e2e8f0"
                        }}>
                        {["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."][m-1]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Month Title */}
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:22,fontWeight:800,color:"#1e3a5f"}}>
                สรุปการเฝ้าระวัง HAI เดือน{MONTH_NAMES[selMonth]} {selYear+543}
              </div>
              <div style={{color:"#64748b",fontSize:13,marginTop:4}}>รพ.สต. แก่งผักกูด อ.ท่าหลวง จ.ลพบุรี</div>
            </div>

            {/* KPI */}
            <div className="g4" style={{marginBottom:20}}>
              {[
                {val:mTotal,label:"ผู้ป่วยที่เยี่ยมบ้าน",color:"#2563eb",icon:"👥"},
                {val:mInfected,label:"พบการติดเชื้อ",color:"#ef4444",icon:"🦠"},
                {val:`${mRate}%`,label:"อัตราการติดเชื้อ",color:"#f59e0b",icon:"📉"},
                {val:mNone,label:"ไม่พบการติดเชื้อ",color:"#10b981",icon:"✅"},
              ].map((k,i)=>(
                <div key={i} className="kpi">
                  <div style={{fontSize:26,marginBottom:4}}>{k.icon}</div>
                  <div className="kpi-val" style={{color:k.color}}>{k.val}</div>
                  <div className="kpi-label">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Infection breakdown boxes */}
            <div className="g3" style={{marginBottom:20}}>
              {[
                {label:"ไม่พบการติดเชื้อ",val:mNone,color:"#10b981",bg:"#d1fae5",border:"#6ee7b7"},
                {label:"ติดเชื้อจากชุมชน",val:mCommunity,color:"#d97706",bg:"#fef9c3",border:"#fde68a"},
                {label:"ติดเชื้อจากโรงพยาบาล",val:mHospital,color:"#dc2626",bg:"#fee2e2",border:"#fca5a5"},
              ].map((b,i)=>(
                <div key={i} style={{background:b.bg,border:`1.5px solid ${b.border}`,borderRadius:14,padding:"18px 20px",textAlign:"center"}}>
                  <div style={{fontSize:28,fontWeight:800,color:b.color}}>{b.val} ราย</div>
                  <div style={{fontSize:13,color:b.color,fontWeight:600,marginTop:4}}>{b.label}</div>
                  <div style={{fontSize:12,color:"#64748b",marginTop:2}}>{mTotal>0?((b.val/mTotal)*100).toFixed(1):0}% ของทั้งหมด</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="g2" style={{marginBottom:20}}>
              <div className="card">
                <div style={{fontWeight:700,color:"#1e3a5f",borderLeft:"4px solid #2563eb",paddingLeft:10,marginBottom:14}}>
                  สัดส่วนการติดเชื้อ — {MONTH_NAMES[selMonth]} {selYear+543}
                </div>
                {mTotal===0 ? <div style={{textAlign:"center",color:"#94a3b8",padding:40}}>ไม่มีข้อมูลในเดือนนี้</div> :
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart><Pie data={mPieData} cx="50%" cy="50%" outerRadius={72} dataKey="value"
                    label={({name,value,percent})=>value>0?`${name} ${value} ราย`:""} labelLine={false} fontSize={11}>
                    {mPieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie><Tooltip formatter={(v)=>`${v} ราย`}/></PieChart>
                </ResponsiveContainer>}
              </div>
              <div className="card">
                <div style={{fontWeight:700,color:"#1e3a5f",borderLeft:"4px solid #2563eb",paddingLeft:10,marginBottom:14}}>
                  ภาพรวมทั้งปี {selYear+543}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={yearData} margin={{top:5,right:5,left:-25,bottom:5}}
                    onClick={d=>{ if(d&&d.activeLabel){ const idx=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."].indexOf(d.activeLabel)+1; if(idx>0) setSelMonth(idx); }}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                    <XAxis dataKey="month" tick={{fontSize:11}}/>
                    <YAxis tick={{fontSize:11}}/>
                    <Tooltip formatter={(v,n)=>[`${v} ราย`,n]}/>
                    <Legend wrapperStyle={{fontSize:11}}/>
                    <Bar dataKey="ไม่ติดเชื้อ" fill="#10b981" radius={[3,3,0,0]}/>
                    <Bar dataKey="ติดเชื้อชุมชน" fill="#f59e0b" radius={[3,3,0,0]}/>
                    <Bar dataKey="ติดเชื้อรพ" fill="#ef4444" radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{textAlign:"center",fontSize:11,color:"#94a3b8",marginTop:4}}>คลิกแท่งกราฟเพื่อดูรายละเอียดเดือนนั้น</div>
              </div>
            </div>

            {/* Organism chart */}
            {mOrgChart.length>0 && <div className="card" style={{marginBottom:20}}>
              <div style={{fontWeight:700,color:"#1e3a5f",borderLeft:"4px solid #ef4444",paddingLeft:10,marginBottom:14}}>เชื้อที่พบในเดือน{MONTH_NAMES[selMonth]}</div>
              <ResponsiveContainer width="100%" height={Math.max(120,mOrgChart.length*44)}>
                <BarChart data={mOrgChart} layout="vertical" margin={{left:10,right:30}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
                  <XAxis type="number" tick={{fontSize:12}} allowDecimals={false}/>
                  <YAxis type="category" dataKey="name" tick={{fontSize:12}} width={140}/>
                  <Tooltip formatter={v=>`${v} ราย`}/>
                  <Bar dataKey="value" fill="#ef4444" radius={[0,6,6,0]} label={{position:"right",fontSize:12,fill:"#334155"}}/>
                </BarChart>
              </ResponsiveContainer>
            </div>}

            {/* System chart */}
            {mSysChart.length>0 && <div className="card" style={{marginBottom:20}}>
              <div style={{fontWeight:700,color:"#1e3a5f",borderLeft:"4px solid #8b5cf6",paddingLeft:10,marginBottom:14}}>การติดเชื้อแยกตามระบบ/อวัยวะ เดือน{MONTH_NAMES[selMonth]}</div>
              <ResponsiveContainer width="100%" height={Math.max(120,mSysChart.length*44)}>
                <BarChart data={mSysChart} layout="vertical" margin={{left:10,right:30}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
                  <XAxis type="number" tick={{fontSize:12}} allowDecimals={false}/>
                  <YAxis type="category" dataKey="name" tick={{fontSize:12}} width={160}/>
                  <Tooltip formatter={v=>`${v} ราย`}/>
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0,6,6,0]} label={{position:"right",fontSize:12,fill:"#334155"}}/>
                </BarChart>
              </ResponsiveContainer>
            </div>}

            {/* Monthly table summary */}
            <div className="card" style={{marginBottom:20}}>
              <div style={{fontWeight:700,color:"#1e3a5f",borderLeft:"4px solid #0ea5e9",paddingLeft:10,marginBottom:14}}>
                ตารางสรุปรายปี {selYear+543}
              </div>
              <div className="tw">
                <table>
                  <thead>
                    <tr>
                      <th>เดือน</th><th>เยี่ยมทั้งหมด</th><th>ไม่พบติดเชื้อ</th>
                      <th>ติดเชื้อชุมชน</th><th>ติดเชื้อรพ.</th><th>รวมติดเชื้อ</th><th>อัตรา (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData.map((row,i)=>{
                      const totalInf = row.ติดเชื้อชุมชน+row.ติดเชื้อรพ;
                      const r = row.total>0?((totalInf/row.total)*100).toFixed(1):"0.0";
                      const isSel = i+1===selMonth;
                      return (
                        <tr key={i} style={{background:isSel?"#eff6ff":"",cursor:"pointer"}} onClick={()=>setSelMonth(i+1)}>
                          <td style={{fontWeight:isSel?700:400,color:isSel?"#2563eb":"#334155"}}>{MONTH_NAMES[i+1]}{isSel&&" ◀"}</td>
                          <td style={{textAlign:"center"}}>{row.total||"-"}</td>
                          <td style={{textAlign:"center",color:"#059669",fontWeight:row.ไม่ติดเชื้อ>0?600:400}}>{row.ไม่ติดเชื้อ||"-"}</td>
                          <td style={{textAlign:"center",color:"#d97706",fontWeight:row.ติดเชื้อชุมชน>0?600:400}}>{row.ติดเชื้อชุมชน||"-"}</td>
                          <td style={{textAlign:"center",color:"#dc2626",fontWeight:row.ติดเชื้อรพ>0?600:400}}>{row.ติดเชื้อรพ||"-"}</td>
                          <td style={{textAlign:"center",fontWeight:totalInf>0?700:400,color:totalInf>0?"#dc2626":"#94a3b8"}}>{totalInf||"-"}</td>
                          <td style={{textAlign:"center"}}>
                            {row.total>0 ? <span style={{color:Number(r)>5?"#dc2626":Number(r)>0?"#d97706":"#059669",fontWeight:600}}>{r}%</span> : "-"}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Annual total row */}
                    {(()=>{
                      const totT=yearData.reduce((a,r)=>a+r.total,0);
                      const totN=yearData.reduce((a,r)=>a+r.ไม่ติดเชื้อ,0);
                      const totC=yearData.reduce((a,r)=>a+r.ติดเชื้อชุมชน,0);
                      const totH=yearData.reduce((a,r)=>a+r.ติดเชื้อรพ,0);
                      const totI=totC+totH;
                      return <tr style={{background:"#f8fafc",borderTop:"2px solid #e2e8f0"}}>
                        <td style={{fontWeight:700,color:"#1e3a5f"}}>รวมทั้งปี</td>
                        <td style={{textAlign:"center",fontWeight:700}}>{totT}</td>
                        <td style={{textAlign:"center",fontWeight:700,color:"#059669"}}>{totN}</td>
                        <td style={{textAlign:"center",fontWeight:700,color:"#d97706"}}>{totC}</td>
                        <td style={{textAlign:"center",fontWeight:700,color:"#dc2626"}}>{totH}</td>
                        <td style={{textAlign:"center",fontWeight:700,color:"#dc2626"}}>{totI}</td>
                        <td style={{textAlign:"center",fontWeight:700,color:totT>0&&(totI/totT*100)>5?"#dc2626":"#d97706"}}>{totT>0?((totI/totT)*100).toFixed(1):0}%</td>
                      </tr>;
                    })()}
                  </tbody>
                </table>
              </div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:8}}>* คลิกแถวเพื่อดูรายละเอียดเดือนนั้น</div>
            </div>

            {/* Patient list of selected month */}
            <div className="card">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontWeight:700,color:"#1e3a5f",borderLeft:"4px solid #2563eb",paddingLeft:10}}>
                  รายชื่อผู้ป่วย — {MONTH_NAMES[selMonth]} {selYear+543} ({mTotal} ราย)
                </div>
              </div>
              {mTotal===0 ? (
                <div style={{textAlign:"center",color:"#94a3b8",padding:30}}>ไม่มีข้อมูลในเดือนนี้</div>
              ) : (
                <div className="tw">
                  <table>
                    <thead><tr><th>#</th><th>ชื่อ-สกุล</th><th>อายุ</th><th>สิทธิ์</th><th>วันที่เยี่ยม</th><th>ติดเชื้อ</th><th>เชื้อ</th><th>สรุป</th></tr></thead>
                    <tbody>{monthRecords.map((r,i)=>(
                      <tr key={r.id}>
                        <td style={{color:"#94a3b8"}}>{i+1}</td>
                        <td style={{fontWeight:600}}>{r.fullName}</td>
                        <td>{r.age}</td>
                        <td><span className="chip chip-blue">{r.right}</span></td>
                        <td>{r.visitDate}</td>
                        <td><span className={`chip ${r.hasInfection==="มี"?"chip-red":"chip-green"}`}>{r.hasInfection==="มี"?"🦠 มี":"✅ ไม่มี"}</span></td>
                        <td>{r.organism||<span style={{color:"#94a3b8"}}>-</span>}</td>
                        <td><span className={`chip ${r.summaryInfection==="ไม่พบการติดเชื้อ"?"chip-green":r.summaryInfection==="ติดเชื้อจากโรงพยาบาล"?"chip-red":"chip-yellow"}`}>{r.summaryInfection}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ LIST ══ */}
        {tab === "list" && (
          <div className="fade">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1e3a5f" }}>รายการผู้ป่วยทั้งหมด ({records.length} ราย)</div>
              <button onClick={startNew} className="btn btn-primary">+ บันทึกใหม่</button>
            </div>
            <div className="tw"><table>
              <thead><tr><th>#</th><th>ชื่อ-สกุล</th><th>อายุ</th><th>สิทธิ์</th><th>วันที่เยี่ยม</th><th>ติดเชื้อ</th><th>สรุป</th><th>จัดการ</th></tr></thead>
              <tbody>{records.map((r, i) => (
                <tr key={r.id}>
                  <td style={{ color: "#94a3b8" }}>{i + 1}</td><td style={{ fontWeight: 600 }}>{r.fullName}</td><td>{r.age}</td>
                  <td><span className="chip chip-blue">{r.right}</span></td><td>{r.visitDate}</td>
                  <td><span className={`chip ${r.hasInfection === "มี" ? "chip-red" : "chip-green"}`}>{r.hasInfection === "มี" ? "🦠 มี" : "✅ ไม่มี"}</span></td>
                  <td><span className={`chip ${r.summaryInfection === "ไม่พบการติดเชื้อ" ? "chip-green" : r.summaryInfection === "ติดเชื้อจากโรงพยาบาล" ? "chip-red" : "chip-yellow"}`}>{r.summaryInfection}</span></td>
                  <td><div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-secondary" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => editRec(r)}>✏️ แก้ไข</button>
                    <button className="btn btn-primary" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setPrintRecord(r)}>🖨️ พิมพ์</button>
                    <button className="btn btn-danger" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setDelConfirm(r.id)}>🗑️</button>
                  </div></td>
                </tr>
              ))}{records.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", color: "#94a3b8", padding: 30 }}>ยังไม่มีข้อมูล</td></tr>}</tbody>
            </table></div>
          </div>
        )}

        {/* ══ FORM ══ */}
        {tab === "form" && (
          <div className="fade">
            {saved && <div style={{ background: "#d1fae5", border: "1.5px solid #10b981", borderRadius: 12, padding: "13px 18px", marginBottom: 18, fontWeight: 600, color: "#065f46" }}>✅ บันทึกข้อมูลเรียบร้อย กำลังไปหน้ารายการ...</div>}

            {/* ── ส่วน 1 ── */}
            <div className="card">
              <SectionHeader num="1" title="ข้อมูลทั่วไป" icon="👤" />
              <div className="g3" style={{ marginBottom: 14 }}>
                <div style={{ gridColumn: "1/3" }}><label>ชื่อ-นามสกุล *</label><input type="text" placeholder="ชื่อ นามสกุล" value={form.fullName} onChange={e => set("fullName", e.target.value)} /></div>
                <div><label>อายุ (ปี)</label><input type="number" value={form.age} onChange={e => set("age", e.target.value)} /></div>
              </div>
              <div className="g3" style={{ marginBottom: 14 }}>
                <div><label>ส่งต่อจากโรงพยาบาล</label><select value={form.referFrom} onChange={e => set("referFrom", e.target.value)}><option value="">-- เลือก --</option>{HOSPITALS.map(h => <option key={h}>{h}</option>)}</select></div>
                <div><label>สิทธิการรักษา</label><select value={form.right} onChange={e => set("right", e.target.value)}><option value="">-- เลือก --</option>{RIGHTS.map(r => <option key={r}>{r}</option>)}</select></div>
              </div>
              <div className="g2" style={{ marginBottom: 14 }}>
                <div><label>บันทึกเข้าแฟ้ม รพ.สต. วันที่/เวลา</label><div style={{ display: "flex", gap: 8 }}><input type="date" value={form.admitDate} onChange={e => set("admitDate", e.target.value)} /><input type="time" value={form.admitTime} onChange={e => set("admitTime", e.target.value)} style={{ width: 120 }} /></div></div>
                <div><label>ติดตามลงเยี่ยมบ้านวันที่/เวลา</label><div style={{ display: "flex", gap: 8 }}><input type="date" value={form.visitDate} onChange={e => set("visitDate", e.target.value)} /><input type="time" value={form.visitTime} onChange={e => set("visitTime", e.target.value)} style={{ width: 120 }} /></div></div>
              </div>
              <div className="sc">
                <label style={{ fontWeight: 600, color: "#1e3a5f" }}>รักษาตัวในโรงพยาบาลครั้งสุดท้าย</label>
                <div className="g3" style={{ marginTop: 10 }}>
                  <div><label>โรงพยาบาล</label><select value={form.lastHospital} onChange={e => set("lastHospital", e.target.value)}><option value="">-- เลือก --</option>{HOSPITALS.map(h => <option key={h}>{h}</option>)}</select></div>
                  <div><label>วันที่</label><input type="date" value={form.lastHospitalDate} onChange={e => set("lastHospitalDate", e.target.value)} /></div>
                  <div><label>เวลา</label><input type="time" value={form.lastHospitalTime} onChange={e => set("lastHospitalTime", e.target.value)} /></div>
                </div>
                <div style={{ marginTop: 10 }}><label>ด้วยโรคหรืออาการ</label><input type="text" placeholder="ระบุโรค/อาการ" value={form.diagnosis} onChange={e => set("diagnosis", e.target.value)} /></div>
              </div>
              <div className="sc" style={{ marginTop: 14 }}>
                <label style={{ fontWeight: 600, color: "#1e3a5f" }}>ขณะลงเยี่ยมบ้านมีการติดเชื้อในร่างกาย</label>
                <div className="rg" style={{ margin: "10px 0" }}>{["มี", "ไม่มี"].map(v => <label key={v}><input type="radio" name="hasInfection" value={v} checked={form.hasInfection === v} onChange={() => set("hasInfection", v)} /> {v}</label>)}</div>
                {form.hasInfection === "มี" && <div className="g2"><div><label>การติดเชื้อที่ระบบ/อวัยวะ</label><input type="text" placeholder="เช่น ระบบทางเดินปัสสาวะ" value={form.infectedSystem} onChange={e => set("infectedSystem", e.target.value)} /></div><div><label>เชื้อที่พบ</label><input type="text" placeholder="เช่น E. coli, MRSA" value={form.organism} onChange={e => set("organism", e.target.value)} /></div></div>}
              </div>
            </div>

            {/* ── ส่วน 2 ── */}
            <div className="card">
              <SectionHeader num="2" title="ผู้ป่วยเสี่ยงต่อการติดเชื้อระบบทางเดินหายใจ/ปอดอักเสบ" icon="🫁" />
              <div className="sc">
                <div className="g2">
                  <div>
                    <label>On Tracheostomy Tube</label>
                    <div className="rg" style={{ marginBottom: 8 }}>{["ใส่", "ไม่ใส่"].map(v => <label key={v}><input type="radio" name="onTrach" value={v} checked={form.onTrach === v} onChange={() => set("onTrach", v)} /> {v}</label>)}</div>
                    {form.onTrach === "ใส่" && <><label>ชนิด</label><div className="rg">{["พลาสติก", "โลหะ"].map(v => <label key={v}><input type="radio" name="trachType" value={v} checked={form.trachType === v} onChange={() => set("trachType", v)} /> {v}</label>)}</div></>}
                  </div>
                  <div>
                    <label>รอบแผลมีลักษณะ <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายข้อ)</span></label>
                    <MultiSelect options={WOUND_AROUND_OPTS} value={arr(form.woundAround)} onChange={v => set("woundAround", v)} placeholder="-- เลือกลักษณะรอบแผล --" />
                  </div>
                </div>
              </div>
              <div className="sc">
                <div className="g2">
                  <div>
                    <label>On Oxygen</label>
                    <div className="rg" style={{ marginBottom: 8 }}>{["ใช้", "ไม่ได้ใช้"].map(v => <label key={v}><input type="radio" name="onOxygen" value={v} checked={form.onOxygen === v} onChange={() => set("onOxygen", v)} /> {v}</label>)}</div>
                    {form.onOxygen === "ใช้" && <><label>ชนิด</label><div className="rg">{["Cannula", "Mask with bag"].map(v => <label key={v}><input type="radio" name="oxygenType" value={v} checked={form.oxygenType === v} onChange={() => set("oxygenType", v)} /> {v}</label>)}</div></>}
                  </div>
                  <div>
                    <div className="g3" style={{ marginBottom: 0 }}>
                      <div><label>RR (ครั้ง/นาที)</label><input type="number" placeholder="ครั้ง/นาที" value={form.rr} onChange={e => set("rr", e.target.value)} /></div>
                      <div><label>SpO₂ (%)</label><input type="number" placeholder="%" value={form.spo2} onChange={e => set("spo2", e.target.value)} /></div>
                      <div><label>อุณหภูมิ (°C)</label><input type="number" step="0.1" placeholder="°C" value={form.temp} onChange={e => set("temp", e.target.value)} /></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sc">
                <label style={{ fontWeight: 600, color: "#1e3a5f" }}>On NG Tube</label>
                <div className="rg" style={{ margin: "8px 0" }}>{["ใส่", "ไม่ได้ใส่"].map(v => <label key={v}><input type="radio" name="onNG" value={v} checked={form.onNG === v} onChange={() => set("onNG", v)} /> {v}</label>)}</div>
                {form.onNG === "ใส่" && <div className="g3">
                  <div><label>วันที่ใส่</label><input type="date" value={form.ngInsertDate} onChange={e => set("ngInsertDate", e.target.value)} /></div>
                  <div><label>วันที่ครบเปลี่ยน</label><input type="date" value={form.ngChangeDate} onChange={e => set("ngChangeDate", e.target.value)} /></div>
                  <div><label>จำนวนมื้อ/วัน</label><input type="number" value={form.ngFeedPerDay} onChange={e => set("ngFeedPerDay", e.target.value)} /></div>
                  <div><label>ปริมาณ/มื้อ (มล.)</label><input type="number" value={form.ngFeedPerMeal} onChange={e => set("ngFeedPerMeal", e.target.value)} /></div>
                  <div><label>ชนิดอาหาร</label><div className="rg" style={{ marginTop: 8 }}>{["สำเร็จรูป", "ปรุงเอง"].map(v => <label key={v}><input type="radio" name="ngFoodType" value={v} checked={form.ngFoodType === v} onChange={() => set("ngFoodType", v)} /> {v}</label>)}</div></div>
                </div>}
              </div>
              <div>
                <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 8, display: "block" }}>อาการผิดปกติที่เกี่ยวกับระบบทางเดินหายใจ <span style={{ color: "#94a3b8", fontSize: 11 }}>(กดเลือกได้หลายข้อ)</span></label>
                <CheckTags options={RESP_SYMS} value={arr(form.respiratorySymptoms)} onChange={v => set("respiratorySymptoms", v)} />
              </div>
            </div>

            {/* ── ส่วน 3 ── */}
            <div className="card">
              <SectionHeader num="3" title="ผู้ป่วยเสี่ยงต่อการติดเชื้อระบบทางเดินปัสสาวะ" icon="🔬" />
              <div className="sc">
                <label>ความสามารถในการปัสสาวะ</label>
                <div className="rg" style={{ margin: "8px 0 14px" }}>{["ปัสสาวะได้เอง", "ใส่สายสวนปัสสาวะ"].map(v => <label key={v}><input type="radio" name="urineAbility" value={v} checked={form.urineAbility === v} onChange={() => set("urineAbility", v)} /> {v}</label>)}</div>
                {form.urineAbility === "ใส่สายสวนปัสสาวะ" && <div className="g2" style={{ marginBottom: 14 }}>
                  <div><label>วันที่ใส่</label><input type="date" value={form.catheterInsertDate} onChange={e => set("catheterInsertDate", e.target.value)} /></div>
                  <div><label>วันที่ครบเปลี่ยน</label><input type="date" value={form.catheterChangeDate} onChange={e => set("catheterChangeDate", e.target.value)} /></div>
                </div>}
                <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 8, display: "block" }}>อาการผิดปกติที่เกี่ยวกับระบบทางเดินปัสสาวะ <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายข้อ)</span></label>
                <MultiSelect options={URINE_SYMS} value={arr(form.urineSymptoms)} onChange={v => set("urineSymptoms", v)} placeholder="-- เลือกอาการผิดปกติ --" />
                <div style={{ marginTop: 12 }}><label>วันที่เริ่มมีอาการผิดปกติ</label><input type="date" value={form.urineSymptomDate} onChange={e => set("urineSymptomDate", e.target.value)} style={{ maxWidth: 200 }} /></div>
              </div>
            </div>

            {/* ── ส่วน 4 ── */}
            <div className="card">
              <SectionHeader num="4" title="ผู้ป่วยเสี่ยงต่อการติดเชื้อแผลเรื้อรังและแผลกดทับ" icon="🩹" />
              <div className="g3" style={{ marginBottom: 14 }}>
                <div><label>วันที่เริ่มมีแผล</label><input type="date" value={form.woundStartDate} onChange={e => set("woundStartDate", e.target.value)} /></div>
                <div><label>วันที่ลงประเมินบาดแผล</label><input type="date" value={form.woundAssessDate} onChange={e => set("woundAssessDate", e.target.value)} /></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label>อวัยวะในร่างกายที่มีแผล <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายตำแหน่ง)</span></label>
                <MultiSelect options={BODY_PARTS} value={arr(form.woundLocation)} onChange={v => set("woundLocation", v)} placeholder="-- เลือกอวัยวะ --" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label>ลักษณะบาดแผล <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายข้อ)</span></label>
                <MultiSelect options={["แห้งสะอาด", "มีสิ่งคัดหลั่งใส", "มีสิ่งคัดหลั่งขุ่น/หนอง", "มีเนื้อตาย", "มีอาการอักเสบ", "มีกลิ่นเหม็น", "บวมแดงร้อน", "มีเลือดออก"]} value={arr(form.woundCharacter)} onChange={v => set("woundCharacter", v)} placeholder="-- เลือกลักษณะ --" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label>ชนิดของบาดแผล <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายข้อ)</span></label>
                <MultiSelect options={["แผลกดทับ", "แผลเบาหวาน", "แผลเรื้อรัง", "แผลผ่าตัด", "แผลไหม้", "อื่นๆ"]} value={arr(form.woundType)} onChange={v => set("woundType", v)} placeholder="-- เลือกชนิด --" />
                {arr(form.woundType).includes("อื่นๆ") && <div style={{ marginTop: 8 }}><label>ระบุชนิดแผล (อื่นๆ)</label><input type="text" placeholder="ระบุรายละเอียด..." value={form.woundTypeOther} onChange={e => set("woundTypeOther", e.target.value)} /></div>}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label>ข้อบ่งชี้ที่เสี่ยงต่อการติดเชื้อ <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายข้อ)</span></label>
                <MultiSelect options={["มีหนอง/สิ่งคัดหลั่งผิดปกติ", "บวมแดงร้อน", "มีกลิ่น", "ไข้สูง > 38°C", "เนื้อตาย", "แผลแย่ลงจากเดิม", "ขอบแผลไม่ติด"]} value={arr(form.woundRisk)} onChange={v => set("woundRisk", v)} placeholder="-- เลือกข้อบ่งชี้ --" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 8, display: "block" }}>คำแนะนำในการดูแลบาดแผล <span style={{ color: "#94a3b8", fontSize: 11 }}>(กดเลือกได้หลายข้อ)</span></label>
                <CheckTags options={WOUND_ADVICE} value={arr(form.woundAdvice)} onChange={v => set("woundAdvice", v)} />
              </div>
              <div className="g2">
                <div><label>วันที่นัดดูแผล</label><input type="date" value={form.woundNextDate} onChange={e => set("woundNextDate", e.target.value)} /></div>
                <div>
                  <label>โรงพยาบาลที่นัดดูแผล <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายที่)</span></label>
                  <MultiSelect options={["รพ.สต.แก่งผักกูด", ...HOSPITALS]} value={arr(form.woundNextHospital)} onChange={v => set("woundNextHospital", v)} placeholder="-- เลือกโรงพยาบาล --" />
                </div>
              </div>
            </div>

            {/* ── ส่วน 5 ── */}
            <div className="card">
              <SectionHeader num="5" title="ผู้ป่วยเสี่ยงต่อการติดเชื้อที่แผลผ่าตัด (SSI)" icon="🔪" />
              <div style={{ marginBottom: 14 }}>
                <label>ประเภทการผ่าตัด <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายข้อ)</span></label>
                <MultiSelect options={["ผ่าตัดเปิดท้อง", "ผ่าตัดกระดูก/ข้อ", "ผ่าตัดหัวใจ/ทรวงอก", "ผ่าตัดสมอง", "ผ่าตัดมะเร็ง", "ผ่าตัดนิ่ว", "ผ่าตัดไส้ติ่ง", "ผ่าตัดคลอด (C/S)", "อื่นๆ"]} value={arr(form.surgeryType)} onChange={v => set("surgeryType", v)} placeholder="-- เลือกประเภทผ่าตัด --" />
              </div>
              <div style={{ marginBottom: 14 }}><label>รายละเอียดการผ่าตัด</label><textarea placeholder="ระบุรายละเอียด เช่น Lap cholecystectomy, TKR ข้างขวา, CABG..." value={form.surgeryDetail} onChange={e => set("surgeryDetail", e.target.value)} /></div>
              <div className="g2" style={{ marginBottom: 14 }}>
                <div><label>วันที่ผ่าตัด</label><input type="date" value={form.surgeryDate} onChange={e => set("surgeryDate", e.target.value)} /></div>
                <div><label>โรงพยาบาลที่ผ่าตัด</label><select value={form.surgeryHospital} onChange={e => set("surgeryHospital", e.target.value)}><option value="">-- เลือก --</option>{HOSPITALS.map(h => <option key={h}>{h}</option>)}</select></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label>ปัจจัยเสี่ยง SSI <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายข้อ)</span></label>
                <MultiSelect options={["เบาหวาน", "อ้วน (BMI > 30)", "สูบบุหรี่", "ภูมิคุ้มกันต่ำ", "โภชนาการไม่ดี", "ผู้สูงอายุ > 65 ปี", "โรคไต", "ไม่มีปัจจัยเสี่ยง"]} value={arr(form.ssiRisk)} onChange={v => set("ssiRisk", v)} placeholder="-- เลือกปัจจัยเสี่ยง --" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label>ชนิด Dressing <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายข้อ)</span></label>
                <MultiSelect options={["Dry dressing", "Wet dressing", "Hydrocolloid", "Foam dressing", "Silver dressing", "Alginate", "Negative pressure (VAC)"]} value={arr(form.ssiDressing)} onChange={v => set("ssiDressing", v)} placeholder="-- เลือก Dressing --" />
              </div>
              <div style={{ marginBottom: 14 }}><label>วันที่ทำ Dressing ล่าสุด</label><input type="date" value={form.ssiDressingDate} onChange={e => set("ssiDressingDate", e.target.value)} style={{ maxWidth: 200 }} /></div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 8, display: "block" }}>อาการแผลผ่าตัด <span style={{ color: "#94a3b8", fontSize: 11 }}>(กดเลือกได้หลายข้อ)</span></label>
                <CheckTags options={SSI_SYMS} value={arr(form.ssiSymptoms)} onChange={v => set("ssiSymptoms", v)} />
              </div>
              <div>
                <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 8, display: "block" }}>คำแนะนำ/หมายเหตุ <span style={{ color: "#94a3b8", fontSize: 11 }}>(กดเลือกได้หลายข้อ)</span></label>
                <CheckTags options={SSI_NOTES} value={arr(form.ssiNotes)} onChange={v => set("ssiNotes", v)} />
              </div>
            </div>

            {/* ── ส่วน 6 ── */}
            <div className="card">
              <SectionHeader num="6" title="ผู้ป่วยได้รับการทำหัตถการที่ รพ.สต." icon="💉" />
              <div style={{ marginBottom: 12, color: "#64748b", fontSize: 13 }}>รวมถึง: ฉีดยา, ทำแผล, สวนปัสสาวะ, ใส่ NG tube, ล้างไตทางหน้าท้อง (CAPD), เจาะเลือด, IV fluid ฯลฯ</div>
              {procedures.map((p, i) => (
                <div key={i} className="sc" style={{ position: "relative" }}>
                  <button onClick={() => removeP(i)} style={{ position: "absolute", top: 10, right: 10, background: "#fee2e2", border: "none", borderRadius: 8, color: "#dc2626", padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>✕ ลบ</button>
                  <div className="g2" style={{ marginBottom: 10 }}>
                    <div>
                      <label>ชนิดหัตถการ</label>
                      <select value={p.name} onChange={e => setP(i, "name", e.target.value)}>
                        <option value="">-- เลือกหัตถการ --</option>
                        {["ฉีดยา IM/IV", "ทำแผล/ตัดไหม", "สวนปัสสาวะ", "ใส่ NG tube", "ล้างไตทางหน้าท้อง (CAPD)", "เจาะเลือด / Lab", "ให้สารน้ำทางหลอดเลือดดำ (IV fluid)", "ดูด secretion", "เปลี่ยน Tracheostomy tube", "อื่นๆ"].map(v => <option key={v}>{v}</option>)}
                      </select>
                      {p.name === "อื่นๆ" && <div style={{ marginTop: 8 }}><label>ระบุหัตถการ (อื่นๆ)</label><input type="text" placeholder="ระบุรายละเอียดหัตถการ..." value={p.otherDetail || ""} onChange={e => setP(i, "otherDetail", e.target.value)} /></div>}
                    </div>
                    <div><label>วันที่ทำหัตถการ</label><input type="date" value={p.date} onChange={e => setP(i, "date", e.target.value)} /></div>
                    <div style={{ gridColumn: "1/-1" }}><label>ผู้ทำหัตถการ</label><input type="text" placeholder="ชื่อผู้ทำหัตถการ" value={p.by} onChange={e => setP(i, "by", e.target.value)} /></div>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 8, display: "block" }}>อาการ/ความเสี่ยงต่อการติดเชื้อหลังหัตถการ <span style={{ color: "#94a3b8", fontSize: 11 }}>(กดเลือก)</span></label>
                    <CheckTags options={PROC_RISKS} value={arr(p.risks)} onChange={v => setP(i, "risks", v)} />
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addProc} style={{ marginTop: 6 }}>+ เพิ่มหัตถการ</button>
            </div>

            {/* ── ส่วน 7 ── */}
            <div className="card">
              <SectionHeader num="7" title="ผู้ป่วยที่ต้องเฝ้าระวังการแพร่กระจายเชื้อในชุมชน" icon="🌍" />

              {/* MDRO */}
              <div className="sc" style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 10, display: "block" }}>เชื้อดื้อยา (MDRO)</label>
                <div style={{ marginBottom: 10 }}>
                  <label>ชนิดเชื้อดื้อยา <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายชนิด)</span></label>
                  <MultiSelect options={["MRSA", "VRE", "ESBL", "CRE", "MDR-TB", "CRKP", "อื่นๆ"]} value={arr(form.mdroOrganism)} onChange={v => set("mdroOrganism", v)} placeholder="-- เลือก/ไม่มี --" />
                </div>
                <div><label>สถานะ</label><div className="rg" style={{ marginTop: 6 }}>{["ผู้ป่วย (Case)", "ผู้สัมผัส (Contact)", "พาหะ (Carrier)"].map(v => <label key={v}><input type="radio" name="mdroStatus" value={v} checked={form.mdroStatus === v} onChange={() => set("mdroStatus", v)} /> {v}</label>)}</div></div>
              </div>

              {/* TB */}
              <div className="sc" style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 10, display: "block" }}>วัณโรคปอด (Tuberculosis)</label>
                <div className="g2">
                  <div>
                    <label>สถานะ</label>
                    <select value={form.tbStatus} onChange={e => set("tbStatus", e.target.value)}>
                      <option value="">-- เลือก/ไม่มี --</option>
                      {["ผู้ป่วยวัณโรค", "สงสัยวัณโรค", "วัณโรคแฝง (LTBI)", "ผู้สัมผัสร่วมบ้าน"].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  {form.tbStatus && <>
                    <div>
                      <label>ประเภทผู้ป่วย</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                        {["รายใหม่ (New case)", "รายเก่า (Retreatment)", "ผู้สัมผัสร่วมบ้าน (Household contact)"].map(v => (
                          <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, fontWeight: 400, cursor: "pointer", fontSize: 13 }}>
                            <input type="radio" name="tbCaseType" value={v} checked={form.tbCaseType === v} onChange={() => set("tbCaseType", v)} style={{ width: "auto" }} /> {v}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label>ผล Smear / ผลการตรวจ</label>
                      <div className="rg" style={{ marginTop: 8 }}>{["Smear+", "Smear-", "MDR-TB", "ยังไม่มีผล"].map(v => <label key={v}><input type="radio" name="tbSmear" value={v} checked={form.tbSmear === v} onChange={() => set("tbSmear", v)} /> {v}</label>)}</div>
                    </div>
                    <div>
                      <label>จำนวนผู้สัมผัสร่วมบ้าน</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="number" min="0" placeholder="0" value={form.tbContactCount} onChange={e => set("tbContactCount", e.target.value)} style={{ maxWidth: 100 }} />
                        <span style={{ color: "#64748b", fontSize: 13, whiteSpace: "nowrap" }}>คน</span>
                      </div>
                    </div>
                  </>}
                </div>
              </div>

              {/* Community Diseases */}
              <div className="sc">
                <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 10, display: "block" }}>โรคติดเชื้ออื่นๆ ในชุมชน <span style={{ color: "#94a3b8", fontSize: 11 }}>(กดเลือกโรค แล้วเลือกมาตรการ)</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {COMMUNITY_DISEASES.map(d => {
                    const sel = arr(form.communityDiseases).find(x => x.disease === d.name);
                    return (
                      <span key={d.name} className={`ck-tag${sel ? " on" : ""}`} onClick={() => toggleDisease(d.name)}>
                        {sel ? "✓" : "+"} {d.name}
                      </span>
                    );
                  })}
                </div>
                {arr(form.communityDiseases).map(d => {
                  const def = COMMUNITY_DISEASES.find(x => x.name === d.disease);
                  return def ? (
                    <div key={d.disease} style={{ background: "#eff6ff", borderRadius: 10, padding: "12px 14px", marginBottom: 10, border: "1.5px solid #bfdbfe" }}>
                      <div style={{ fontWeight: 700, color: "#1d4ed8", marginBottom: 8 }}>🦠 {d.disease}</div>
                      <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 6, display: "block" }}>มาตรการควบคุมในชุมชน <span style={{ color: "#94a3b8", fontSize: 11 }}>(เลือกได้หลายข้อ)</span></label>
                      <CheckTags options={def.measures} value={arr(d.measures)} onChange={v => setDiseaseMeasures(d.disease, v)} />
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* ── ส่วน 8 ── */}
            <div className="card">
              <SectionHeader num="8" title="สรุปการเฝ้าระวังการติดเชื้อ" icon="📋" />
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600, color: "#1e3a5f", marginBottom: 12, display: "block" }}>ผลการเฝ้าระวัง</label>
                {["ไม่พบการติดเชื้อ", "ติดเชื้อจากชุมชน", "ติดเชื้อจากโรงพยาบาล"].map(v => (
                  <label key={v} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 8, borderRadius: 10, cursor: "pointer", border: `2px solid ${form.summaryInfection === v ? "#2563eb" : "#e2e8f0"}`, background: form.summaryInfection === v ? "#eff6ff" : "#fafbfc", transition: "all .2s" }}>
                    <input type="radio" name="summaryInfection" value={v} checked={form.summaryInfection === v} onChange={() => set("summaryInfection", v)} style={{ width: "auto" }} />
                    <span style={{ fontWeight: form.summaryInfection === v ? 700 : 400, color: form.summaryInfection === v ? "#1d4ed8" : "#475569" }}>{v}</span>
                  </label>
                ))}
              </div>
              <div style={{ borderTop: "1.5px dashed #e2e8f0", paddingTop: 20 }}>
                <div className="g3">
                  <div style={{ gridColumn: "1/3" }}><label>ชื่อผู้บันทึก</label><input type="text" placeholder="ชื่อ-นามสกุล" value={form.recorderName} onChange={e => set("recorderName", e.target.value)} /></div>
                  <div><label>ตำแหน่ง</label><select value={form.recorderPosition} onChange={e => set("recorderPosition", e.target.value)}><option value="">-- เลือก --</option>{POSITIONS.map(p => <option key={p}>{p}</option>)}</select></div>
                </div>
                <div style={{ marginTop: 14, padding: "13px 16px", background: "#f8fafc", borderRadius: 12, border: "1.5px solid #e2e8f0" }}>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 3 }}>หัวหน้า รพ.สต.</div>
                  <div style={{ fontWeight: 700, color: "#1e293b" }}>นางสาวปานรดา ศิริพันธุ์</div>
                </div>
                <div style={{ marginTop: 14 }}><label>วันที่บันทึก</label><input type="date" value={form.recordDate} onChange={e => set("recordDate", e.target.value)} style={{ maxWidth: 200 }} /></div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginBottom: 40 }}>
              <button className="btn btn-secondary" onClick={() => setTab("list")}>ยกเลิก</button>
              <button className="btn btn-success" onClick={saveRecord} style={{ minWidth: 160 }}>💾 {editId ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}</button>
            </div>
          </div>
        )}
      </div>

      {printRecord && <PrintView record={printRecord} onClose={() => setPrintRecord(null)} />}
      {delConfirm && (
        <div className="mo"><div className="md">
          <div style={{ fontSize: 40, textAlign: "center", marginBottom: 14 }}>🗑️</div>
          <div style={{ fontWeight: 700, fontSize: 16, textAlign: "center", marginBottom: 8 }}>ยืนยันการลบ?</div>
          <div style={{ color: "#64748b", textAlign: "center", marginBottom: 22, fontSize: 14 }}>ข้อมูลจะถูกลบและไม่สามารถกู้คืนได้</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDelConfirm(null)}>ยกเลิก</button>
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => delRec(delConfirm)}>ยืนยัน ลบ</button>
          </div>
        </div></div>
      )}
    </div>
  );
}
