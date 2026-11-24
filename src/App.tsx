import { useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, ChevronDown, ChevronRight,
  CircleHelp, Download, Filter, Globe2, LayoutDashboard, MapPinned, Menu,
  Search, Settings2, Sparkles, Store, Tags, Target, TrendingUp, Users, X,
  WashingMachine, BarChart3, Lightbulb
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar
} from 'recharts'

type Lang = 'th' | 'en'
const copy = {
  th: {
    overview:'ภาพรวมตลาด', competitors:'วิเคราะห์คู่แข่ง', pricing:'เปรียบเทียบราคา',
    opportunities:'โอกาสทางการตลาด', reports:'รายงาน', settings:'ตั้งค่า',
    title:'ข้อมูลเชิงลึกตลาดสะดวกซัก', subtitle:'ติดตามคู่แข่ง • วิเคราะห์ราคา • ค้นหาโอกาสเติบโต',
    updated:'ข้อมูลตัวอย่าง', export:'ส่งออกรายงาน', area:'พื้นที่วิเคราะห์',
    areaValue:'ขอนแก่น · รัศมีประมาณ 7 กม.', total:'คู่แข่งในพื้นที่', avg:'ราคาเฉลี่ยซัก',
    competition:'ระดับการแข่งขัน', opportunity:'คะแนนโอกาส', stores:'ร้านค้า',
    marketTrend:'แนวโน้มตลาด', marketSub:'ดัชนีความสนใจและความหนาแน่นของร้าน',
    last7:'7 วันล่าสุด', competitorMap:'แผนที่คู่แข่ง', mapSub:'ตำแหน่งร้านในพื้นที่วิเคราะห์',
    viewMap:'เปิดแผนที่', priceCompare:'เปรียบเทียบราคา', priceSub:'ราคาเริ่มต้นต่อรอบ (บาท)',
    aiTitle:'AI Market Analyst', aiLabel:'INSIGHT สรุปโดย AI', aiText:'พื้นที่นี้มีการแข่งขันระดับปานกลางถึงสูง โดยมีช่องว่างด้านบริการอบด่วนและแพ็กเกจสมาชิก ควรสำรวจความต้องการลูกค้าในช่วงเย็นก่อนปรับโปรโมชั่น',
    recommendation:'คำแนะนำเชิงกลยุทธ์', rec1:'ทดลองแพ็กเกจซัก + อบ ในช่วงเวลาที่มีลูกค้าน้อย', rec2:'สำรวจรีวิวของคู่แข่งเพื่อหา Pain point ด้านบริการ', rec3:'ติดตามราคาและโปรโมชั่นทุก 2 สัปดาห์',
    tableTitle:'คู่แข่งที่ติดตาม', tableSub:'รายการตัวอย่างเพื่อจัดวาง Dashboard', search:'ค้นหาร้านค้า...', name:'ชื่อร้าน',
    distance:'ระยะทาง', wash:'ซักเริ่มต้น', dryer:'อบเริ่มต้น', rating:'คะแนน', status:'สถานะ',
    active:'เปิดให้บริการ', demo:'ข้อมูลตัวอย่าง', navHint:'KPI และกราฟเป็นข้อมูลสาธิต • ค้นหาร้านจริงได้จาก Google Places ด้านล่าง',
    nav:'เมนูหลัก', premium:'MARKET INTELLIGENCE', viewAll:'ดูทั้งหมด', filter:'ตัวกรอง',
    high:'สูง', medium:'ปานกลาง', low:'ต่ำ', language:'ภาษา'
  },
  en: {
    overview:'Market Overview', competitors:'Competitor Analysis', pricing:'Price Comparison',
    opportunities:'Market Opportunities', reports:'Reports', settings:'Settings',
    title:'Laundry Market Intelligence', subtitle:'Track competitors • Analyze pricing • Discover growth opportunities',
    updated:'Sample dashboard', export:'Export report', area:'Analysis area',
    areaValue:'Khon Kaen · approx. 7 km radius', total:'Local competitors', avg:'Average wash price',
    competition:'Competition level', opportunity:'Opportunity score', stores:'stores',
    marketTrend:'Market trend', marketSub:'Interest index and store density',
    last7:'Last 7 days', competitorMap:'Competitor map', mapSub:'Store locations in selected area',
    viewMap:'Open map', priceCompare:'Price comparison', priceSub:'Starting price per cycle (THB)',
    aiTitle:'AI Market Analyst', aiLabel:'AI-GENERATED INSIGHT', aiText:'This area shows moderate-to-high competition, with potential gaps in express drying and membership packages. Validate evening customer demand before adjusting promotions.',
    recommendation:'Strategic recommendations', rec1:'Test wash + dry bundles during low-traffic hours', rec2:'Review competitor feedback to identify service pain points', rec3:'Monitor competitor prices and promotions every two weeks',
    tableTitle:'Tracked competitors', tableSub:'Illustrative sample list for dashboard layout', search:'Search stores...', name:'Store name',
    distance:'Distance', wash:'Wash from', dryer:'Dry from', rating:'Rating', status:'Status',
    active:'Operating', demo:'Demo data', navHint:'KPIs and charts are demo data • search real stores from Google Places below',
    nav:'MAIN MENU', premium:'MARKET INTELLIGENCE', viewAll:'View all', filter:'Filter',
    high:'High', medium:'Moderate', low:'Low', language:'Language'
  }
}
const trend = [
  {day:'Mon',th:'จ.',value:42},{day:'Tue',th:'อ.',value:51},{day:'Wed',th:'พ.',value:47},
  {day:'Thu',th:'พฤ.',value:64},{day:'Fri',th:'ศ.',value:58},{day:'Sat',th:'ส.',value:78},{day:'Sun',th:'อา.',value:69}
]
const competitors = [
  {name:'Wash & Go',area:'ในเมือง',distance:'0.8 กม.',wash:35,dryer:40,rating:4.6,color:'#50d9b0'},
  {name:'Clean Station',area:'กังสดาล',distance:'1.4 กม.',wash:40,dryer:40,rating:4.4,color:'#8b9cff'},
  {name:'Laundry Hub',area:'หลังมหาวิทยาลัย',distance:'2.1 กม.',wash:30,dryer:35,rating:4.2,color:'#f2b66d'},
  {name:'สะอาด 24 ชม.',area:'ถนนมิตรภาพ',distance:'3.2 กม.',wash:40,dryer:45,rating:4.7,color:'#d38bf4'},
]
const priceData = [{name:'Wash & Go',wash:35,dry:40},{name:'Clean Station',wash:40,dry:40},{name:'Laundry Hub',wash:30,dry:35},{name:'สะอาด 24 ชม.',wash:40,dry:45}]
function App() {
  const [lang,setLang] = useState<Lang>('th')
  const [active,setActive] = useState('overview')
  const [query,setQuery] = useState('')
  const [searchArea,setSearchArea] = useState('ขอนแก่น')
  const [realPlaces,setRealPlaces] = useState<Array<{id:string;name:string;address:string;lat?:number;lng?:number;rating:number|null;reviews:number|null;status:string;mapsUrl:string;website:string;phone:string}>>([])
  const [realLoading,setRealLoading] = useState(false)
  const [realError,setRealError] = useState('')
  const [realFetchedAt,setRealFetchedAt] = useState('')
  const [priceEntries,setPriceEntries] = useState<Record<string,{wash:string;dry:string}>>({})
  const [selectedForPricing,setSelectedForPricing] = useState<string[]>([])
  const comparisonPlaces = realPlaces.filter(p => selectedForPricing.includes(p.id))
  const [mobileOpen,setMobileOpen] = useState(false)
  const t = copy[lang]
  const filtered = useMemo(()=>competitors.filter(c=>c.name.toLowerCase().includes(query.toLowerCase())),[query])
  const pricedPlaces = realPlaces.filter(p => priceEntries[p.id] && (priceEntries[p.id].wash.trim() !== '' || priceEntries[p.id].dry.trim() !== ''))
  const ratedPlaces = realPlaces.filter(p => p.rating !== null)
  const lowRatedPlaces = ratedPlaces.filter(p => (p.rating ?? 5) <= 4.0)
  const averageRating = ratedPlaces.length ? ratedPlaces.reduce((sum,p)=>sum+(p.rating ?? 0),0)/ratedPlaces.length : null
  const fetchRealPlaces = async () => {
    setRealLoading(true); setRealError('')
    try {
      const response = await fetch(`/api/places/laundry?location=${encodeURIComponent(searchArea)}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'ไม่สามารถดึงข้อมูลได้')
      setRealPlaces(data.places || []); setRealFetchedAt(data.queriedAt || new Date().toISOString())
    } catch (e) { setRealError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด') }
    finally { setRealLoading(false) }
  }
  const nav = [
    {id:'overview',label:t.overview,icon:LayoutDashboard},
    {id:'competitors',label:t.competitors,icon:Users},
    {id:'pricing',label:t.pricing,icon:Tags},
    {id:'opportunities',label:t.opportunities,icon:Target},
    {id:'reports',label:t.reports,icon:BarChart3},
    {id:'settings',label:t.settings,icon:Settings2},
  ]
  const changePage = (id:string) => {
    setActive(id); setMobileOpen(false)
    if (id === 'overview') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    const targetId: Record<string,string> = { competitors:'competitors-section', pricing:'pricing-section', opportunities:'opportunities-section', reports:'reports-section', settings:'settings-section' }
    window.requestAnimationFrame(() => document.getElementById(targetId[id] || 'overview-section')?.scrollIntoView({ behavior:'smooth', block:'start' }))
  }
  const pageLabel = nav.find(n=>n.id===active)?.label || t.overview
  return <div className="app-shell">
    {mobileOpen && <button className="mobile-scrim" onClick={()=>setMobileOpen(false)} aria-label="Close menu" />}
    <aside className={`sidebar ${mobileOpen?'open':''}`}>
      <div className="brand">
        <div className="brand-icon"><WashingMachine size={22}/></div>
        <div><div className="brand-name">Laundry<span>IQ</span></div><div className="brand-caption">{t.premium}</div></div>
        <button className="close-mobile" onClick={()=>setMobileOpen(false)}><X size={18}/></button>
      </div>
      <div className="workspace"><div className="workspace-avatar">L</div><div className="workspace-text"><b>Laundry Lab</b><small>Business workspace</small></div><ChevronDown size={15}/></div>
      <div className="nav-label">{t.nav}</div>
      <nav>{nav.map(n=><button key={n.id} className={`nav-item ${active===n.id?'active':''}`} onClick={()=>changePage(n.id)}><n.icon size={18}/><span>{n.label}</span>{active===n.id&&<span className="nav-active-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17}/></div><b>{lang==='th'?'ยกระดับการวิเคราะห์':'Upgrade insights'}</b><p>{lang==='th'?'ปลดล็อกข้อมูลเชิงลึกและรายงานขั้นสูง':'Unlock advanced insights and reports'}</p><button onClick={()=>changePage('reports')}>{lang==='th'?'ดูรายงาน':'Explore reports'} <ChevronRight size={14}/></button></div>
        <button className="nav-item" onClick={()=>window.alert(lang==='th'?'ศูนย์ช่วยเหลือ LaundryIQ\n\n1. ค้นหาร้านจริงในแถบข้อมูลจริง\n2. พื้นที่เริ่มต้นคือขอนแก่น\n3. ใช้ข้อมูล Google Places ต้องตั้งค่า API Key ใน Backend\n\nข้อมูล KPI และกราฟบางส่วนยังเป็นตัวอย่าง':'LaundryIQ Help\n\nSearch live mapped stores in the real-data panel. Google Places requires a backend API key. Some dashboard KPIs and charts are demo data.')}><CircleHelp size={18}/><span>{lang==='th'?'ศูนย์ช่วยเหลือ':'Help center'}</span></button>
        <button className="nav-item" onClick={()=>changePage('settings')}><Settings2 size={18}/><span>{t.settings}</span></button>
        <div className="profile"><div className="profile-avatar">SK</div><div className="profile-info"><b>Store Owner</b><small>owner@laundryiq.demo</small></div><ChevronDown size={15}/></div>
      </div>
    </aside>
    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={()=>setMobileOpen(true)}><Menu size={20}/></button>
        <div className="breadcrumb">Workspace <ChevronRight size={14}/><span>{pageLabel}</span></div>
        <div className="top-actions">
          <button className="icon-button language" onClick={()=>setLang(lang==='th'?'en':'th')} title="Switch language"><Globe2 size={17}/><span>{lang==='th'?'TH':'EN'}</span></button>
          <button className="icon-button notification"><Bell size={18}/><i/></button>
          <div className="top-avatar">SK</div>
        </div>
      </header>
      <div className="content" id="overview-section" data-page={active}>
        <div className="page-heading">
          <div><div className="eyebrow"><span className="live-dot"/> {lang==='th'?'MARKET OVERVIEW':'MARKET OVERVIEW'}</div><h1>{active==='overview'?t.title:pageLabel}</h1><p>{active==='overview'?t.subtitle:lang==='th'?'สำรวจข้อมูลตลาดและคู่แข่งในพื้นที่ของคุณ':'Explore market data and competitors in your area'}</p></div>
          <div className="heading-actions"><div className="area-select"><MapPinned size={16}/><div><small>{t.area}</small><b>{t.areaValue}</b></div><ChevronDown size={15}/></div><button className="primary-button" onClick={()=>window.print()}><Download size={16}/>{t.export}</button></div>
        </div>
        <div className="page-shortcuts" aria-label="Dashboard pages">{nav.map(n=><button key={n.id} type="button" className={active===n.id?'selected':''} onClick={()=>changePage(n.id)}>{n.label}</button>)}</div>
        {active==='settings' && <section className="panel" id="settings-section" style={{marginBottom:20,padding:24}}><div className="panel-heading"><div><h2>{t.settings}</h2><p>{lang==='th'?'ตั้งค่าภาษาและพื้นที่ค้นหาข้อมูล':'Configure language and search area'}</p></div></div><div className="live-search-row"><label>{t.language}<select value={lang} onChange={e=>setLang(e.target.value as Lang)}><option value="th">ไทย</option><option value="en">English</option></select></label><label>{t.area}<input value={searchArea} onChange={e=>setSearchArea(e.target.value)} placeholder="เช่น บางนา กรุงเทพฯ" /></label><button className="primary-button" onClick={()=>changePage('overview')}>{lang==='th'?'บันทึกและกลับหน้าภาพรวม':'Save and return'}</button></div></section>}
        {active==='overview' && <div className="demo-notice"><span className="notice-dot"/><span>{t.navHint}</span><span className="notice-right">{t.updated}</span></div>}
        {active==='competitors' && <section className="panel live-data-panel" id="competitors-section">
          <div className="panel-heading live-data-heading"><div><h2>{lang==='th'?'ค้นหาร้านคู่แข่งจากข้อมูลจริง':'Find real competitor stores'}</h2><p>{lang==='th'?'ข้อมูลร้านจาก Google Places API (New) • ต้องตั้งค่า API Key ใน Backend':'Business details and locations from Google Places API (New) • backend key required'}</p></div><span className="live-source">GOOGLE PLACES</span></div>
          <div className="live-search-row"><label>{lang==='th'?'พื้นที่ค้นหา':'Search area'}<input value={searchArea} onChange={e=>setSearchArea(e.target.value)} placeholder={lang==='th'?'เช่น บางนา กรุงเทพฯ':'e.g. Bang Na, Bangkok'} /></label><button className="primary-button" onClick={fetchRealPlaces} disabled={realLoading || !searchArea.trim()}><Search size={15}/>{realLoading?(lang==='th'?'กำลังค้นหา...':'Searching...'):(lang==='th'?'ค้นหาร้านจริง':'Search real stores')}</button><span className="live-count">{realPlaces.length} {lang==='th'?'ร้านที่พบ':'places found'}</span></div>
          {realPlaces.length>0 && <div className="live-search-row" style={{justifyContent:'space-between',marginTop:12}}><span className="live-count">{lang==='th'?`เลือกแล้ว ${selectedForPricing.length} ร้าน`:`${selectedForPricing.length} selected`}</span><button className="primary-button" disabled={selectedForPricing.length===0} onClick={()=>changePage('pricing')}><Tags size={15}/>{lang==='th'?'เปรียบเทียบร้านที่เลือก':'Compare selected stores'} ({selectedForPricing.length})</button></div>}
          {realError && <div className="live-error">{realError}</div>}
          {realPlaces.length>0 && <div className="table-wrap live-table-wrap"><table><thead><tr><th>{lang==='th'?'เลือก':'Select'}</th><th>{lang==='th'?'ชื่อร้าน':'Business'}</th><th>{lang==='th'?'ที่อยู่':'Address'}</th><th>{lang==='th'?'คะแนน':'Rating'}</th><th>{lang==='th'?'รีวิว':'Reviews'}</th><th>{lang==='th'?'สถานะ':'Status'}</th><th>{lang==='th'?'แผนที่':'Map'}</th></tr></thead><tbody>{realPlaces.map(p=><tr key={p.id}><td><input aria-label={lang==='th'?`เลือก ${p.name}`:`Select ${p.name}`} type="checkbox" checked={selectedForPricing.includes(p.id)} onChange={e=>setSelectedForPricing(prev=>e.target.checked?[...prev,p.id]:prev.filter(id=>id!==p.id))}/></td><td><div className="store-cell"><div className="store-icon"><WashingMachine size={16}/></div><div><b>{p.name}</b><small>{p.phone || p.website || 'Google Places listing'}</small></div></div></td><td className="real-address">{p.address}</td><td>{p.rating==null?'—':<span className="rating">★ {p.rating.toFixed(1)}</span>}</td><td>{p.reviews==null?'—':p.reviews.toLocaleString()}</td><td><span className="status-pill"><i/>{p.status==='OPERATIONAL'?(lang==='th'?'เปิดดำเนินการ':'Operational'):p.status==='UNKNOWN'?(lang==='th'?'ไม่มีข้อมูล':'Not provided'):p.status}</span></td><td>{p.mapsUrl?<a className="map-link" href={p.mapsUrl} target="_blank" rel="noreferrer">{lang==='th'?'เปิดแผนที่':'Open map'} ↗</a>:'—'}</td></tr>)}</tbody></table></div>}
          {!realPlaces.length && !realError && <div className="live-empty">{lang==='th'?'พื้นที่เริ่มต้นคือขอนแก่น กด “ค้นหาร้านจริง” เพื่อค้นหาข้อมูลจาก Google Places':'Search an area to load live Google Places listings.'}</div>}
          {realFetchedAt && <div className="live-footnote">Source: Google Places API (New) · {lang==='th'?'เวลาค้นหา':'Fetched'} {new Date(realFetchedAt).toLocaleString(lang==='th'?'th-TH':'en-US')}</div>}
        </section>}
        {active==='overview' && <section className="kpi-grid">
          <Kpi icon={<Store size={18}/>} title={t.total} value="24" unit={t.stores} trend="+8.2%" positive/>
          <Kpi icon={<Tags size={18}/>} title={t.avg} value="฿38" unit={lang==='th'?'ต่อรอบ':'per cycle'} trend="-2.4%" positive={false}/>
          <Kpi icon={<Activity size={18}/>} title={t.competition} value={t.medium} unit={lang==='th'?'ดัชนี 68 / 100':'Index 68 / 100'} trend={lang==='th'?'สูงขึ้น 4%':'up 4%'} positive={false}/>
          <Kpi icon={<Target size={18}/>} title={t.opportunity} value="72" unit="/ 100" trend="+12.5%" positive/>
        </section>}
        {active==='overview' && <section className="main-grid">
          <div className="panel trend-panel">
            <div className="panel-heading"><div><h2>{t.marketTrend}</h2><p>{t.marketSub}</p></div><button className="select-button">{t.last7}<ChevronDown size={14}/></button></div>
            <div className="chart-legend"><span className="legend-dot teal"/>{lang==='th'?'ดัชนีความสนใจ':'Market interest index'}<span className="legend-period">+18.6% <ArrowUpRight size={13}/></span></div>
            <div className="trend-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{top:10,right:4,left:-20,bottom:0}}><defs><linearGradient id="fillTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#51d9b1" stopOpacity={0.22}/><stop offset="100%" stopColor="#51d9b1" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#253145" vertical={false}/><XAxis dataKey={lang==='th'?'th':'day'} axisLine={false} tickLine={false} tick={{fill:'#78869c',fontSize:11}} tickMargin={12}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#78869c',fontSize:11}}/><Tooltip contentStyle={{background:'#111c2d',border:'1px solid #29364b',borderRadius:10,color:'#e8eef7'}}/><Area type="monotone" dataKey="value" stroke="#51d9b1" strokeWidth={2.5} fill="url(#fillTrend)" activeDot={{r:5,fill:'#51d9b1',stroke:'#10221f'}}/></AreaChart></ResponsiveContainer></div>
          </div>
          <div className="panel map-panel">
            <div className="panel-heading"><div><h2>{t.competitorMap}</h2><p>{t.mapSub}</p></div><button className="more-button">•••</button></div>
            <div className="map-visual">
              <div className="map-grid-lines"/>
              <div className="map-road road-a"/><div className="map-road road-b"/><div className="map-road road-c"/>
              <div className="map-river"/>
              <div className="map-center"><div className="map-radius"/><div className="map-pin home"><WashingMachine size={15}/></div><span>{lang==='th'?'ร้านของคุณ':'Your store'}</span></div>
              {competitors.map((c,i)=><div key={c.name} className={`map-marker marker-${i+1}`} style={{'--marker':c.color} as React.CSSProperties}><span>{i+1}</span></div>)}
              <div className="map-label label-a">KHON KAEN</div><div className="map-label label-b">CITY CENTER</div>
              <div className="map-legend"><span><i className="you-dot"/> {lang==='th'?'ร้านของคุณ':'Your store'}</span><span><i className="comp-dot"/> {lang==='th'?'คู่แข่ง':'Competitors'}</span></div>
            </div>
            <div className="map-footer"><div><b>24</b><span>{t.stores}</span></div><div><b>5 km</b><span>{lang==='th'?'รัศมีค้นหา':'Search radius'}</span></div><button onClick={()=>changePage('competitors')}>{t.viewMap}<ChevronRight size={14}/></button></div>
          </div>
        </section>}
        {active==='pricing' && <section className="panel pricing-page-panel" id="pricing-section">
          <div className="panel-heading"><div><h2>{lang==='th'?'เปรียบเทียบราคาซักและอบ':'Compare wash and dry prices'}</h2><p>{lang==='th'?'เลือกคู่แข่งและกรอกราคาที่ตรวจสอบจากร้านจริง':'Select competitors and enter prices verified at each store'}</p></div><span className="live-source">PRICE COMPARISON</span></div>
          <div className="pricing-instructions">{lang==='th'?'ข้อมูล Google Places ไม่มีราคาซัก/อบ โปรดเลือกจากร้านที่ค้นพบ แล้วกรอกราคาจริง (บาท)':'Google Places does not provide wash/dry prices. Select listings and enter verified prices (THB).'}</div>
          {realPlaces.length===0 ? <div className="pricing-empty"><b>{lang==='th'?'ยังไม่มีร้านให้เปรียบเทียบ':'No competitors loaded yet'}</b><p>{lang==='th'?'ไปค้นหาร้านจริงในหน้า “วิเคราะห์คู่แข่ง” ก่อน แล้วกลับมาเลือกและกรอกราคาได้ที่หน้านี้':'Search live stores in Competitor Analysis first, then return here to select and enter prices.'}</p><button className="primary-button" onClick={()=>changePage('competitors')}>{lang==='th'?'ไปค้นหาร้านคู่แข่ง':'Find competitors'}</button></div> :
          <div className="pricing-store-list">
            <div className="pricing-list-toolbar"><b>{lang==='th'?'ร้านคู่แข่งที่ค้นพบ':'Found competitor listings'} ({realPlaces.length})</b><button className="text-button" onClick={()=>setSelectedForPricing(realPlaces.map(p=>p.id))}>{lang==='th'?'เลือกทั้งหมด':'Select all'}</button><button className="text-button" onClick={()=>setSelectedForPricing([])}>{lang==='th'?'ล้างที่เลือก':'Clear selection'}</button></div>
            <div className="table-wrap live-table-wrap"><table><thead><tr><th>{lang==='th'?'เลือก':'Select'}</th><th>{lang==='th'?'ร้าน':'Store'}</th><th>{lang==='th'?'ซัก (บาท)':'Wash (THB)'}</th><th>{lang==='th'?'อบ (บาท)':'Dry (THB)'}</th></tr></thead><tbody>
              {realPlaces.map(place=><tr key={place.id}><td><input type="checkbox" aria-label={`Select ${place.name}`} checked={selectedForPricing.includes(place.id)} onChange={e=>setSelectedForPricing(prev=>e.target.checked?[...prev,place.id]:prev.filter(id=>id!==place.id))}/></td><td><b>{place.name}</b><div className="pricing-address">{place.address}</div></td><td><input className="price-input" type="number" min="0" placeholder="เช่น 40" value={priceEntries[place.id]?.wash ?? ''} onChange={e=>setPriceEntries(prev=>({...prev,[place.id]:{wash:e.target.value,dry:prev[place.id]?.dry ?? ''}}))}/></td><td><input className="price-input" type="number" min="0" placeholder="เช่น 20" value={priceEntries[place.id]?.dry ?? ''} onChange={e=>setPriceEntries(prev=>({...prev,[place.id]:{wash:prev[place.id]?.wash ?? '',dry:e.target.value}}))}/></td></tr>)}
            </tbody></table></div>
            <div className="pricing-summary"><b>{lang==='th'?'เลือกแล้ว':'Selected'}: {selectedForPricing.length} {lang==='th'?'ร้าน':'stores'}</b><span>{lang==='th'?'กรอกราคาแล้ว':'Prices entered'}: {pricedPlaces.length}</span></div>
            {pricedPlaces.length>0 && <div className="pricing-results"><h3>{lang==='th'?'ผลเปรียบเทียบราคาที่กรอก':'Comparison of entered prices'}</h3>{(['wash','dry'] as const).map(kind=>{const values=pricedPlaces.map(p=>({name:p.name,value:Number(priceEntries[p.id]?.[kind])})).filter(x=>Number.isFinite(x.value)&&x.value>0);return <div className="pricing-result-row" key={kind}><b>{kind==='wash'?(lang==='th'?'ราคาซัก':'Wash price'):(lang==='th'?'ราคาอบ':'Dry price')}</b>{values.length? <span>{lang==='th'?'ต่ำสุด':'Lowest'}: ฿{Math.min(...values.map(x=>x.value))} · {lang==='th'?'เฉลี่ย':'Average'}: ฿{(values.reduce((s,x)=>s+x.value,0)/values.length).toFixed(2)}</span>:<span>{lang==='th'?'ยังไม่ได้กรอกราคา':'No price entered'}</span>}</div>})}</div>}
          </div>}
        </section>}
        {active==='opportunities' && <section className="panel market-opportunity-page" id="opportunities-section">
          <div className="panel-heading"><div><div className="ai-heading"><div className="ai-icon"><Target size={17}/></div><div><h2>{t.opportunities}</h2><p>{lang==='th'?'วิเคราะห์สัญญาณตลาดจากร้านจริงที่ค้นพบ':'Market signals based on actual listings found'}</p></div></div></div><span className="ai-status">{lang==='th'?'วิเคราะห์ตลาด':'MARKET'}</span></div>
          <div className="market-signal-grid">
            <div className="market-signal-card"><span>{lang==='th'?'ร้านที่พบ':'Listings found'}</span><strong>{realPlaces.length}</strong><small>{lang==='th'?'ร้านจาก Google Places':'Google Places results'}</small></div>
            <div className="market-signal-card"><span>{lang==='th'?'คะแนนเฉลี่ย':'Average rating'}</span><strong>{averageRating===null?'—':averageRating.toFixed(1)}{averageRating!==null&&<small> / 5</small>}</strong><small>{lang==='th'?`${ratedPlaces.length} ร้านมีคะแนน`:`${ratedPlaces.length} rated listings`}</small></div>
            <div className="market-signal-card"><span>{lang==='th'?'คะแนน ≤ 4.0':'Rating ≤ 4.0'}</span><strong>{lowRatedPlaces.length}</strong><small>{lang==='th'?'ร้านที่ควรตรวจสอบรีวิว':'Listings to investigate'}</small></div>
          </div>
          {realPlaces.length===0 ? <div className="market-empty-state"><div className="ai-icon"><Search size={20}/></div><h3>{lang==='th'?'ยังไม่มีข้อมูลตลาด':'No market data yet'}</h3><p>{lang==='th'?'ค้นหาร้านซักผ้าในหน้า วิเคราะห์คู่แข่ง ก่อน แล้วข้อมูลจริงจะแสดงที่นี่':'Search for laundromats in Competitor Analysis. Real listing metrics will appear here.'}</p><button className="primary-button" onClick={()=>changePage('competitors')}>{lang==='th'?'ไปค้นหาร้าน':'Search competitors'}</button></div> : <div className="market-opportunity-content">
            <div className="market-opportunity-note"><b>{lang==='th'?'สัญญาณการแข่งขันเบื้องต้น':'Preliminary competition signal'}</b><p>{lang==='th'?`พบร้าน ${realPlaces.length} ร้านในผลค้นหานี้${averageRating===null?'':` คะแนนเฉลี่ย ${averageRating.toFixed(1)} จาก 5`}. ใช้ข้อมูลนี้ประกอบการสำรวจ ไม่ใช่การวัดขนาดตลาดหรือยืนยันกำไร`:`${realPlaces.length} listings in this search${averageRating===null?'':`, with average rating ${averageRating.toFixed(1)} / 5`}. This is a research signal, not market size or a profit forecast.`}</p></div>
            <h3>{lang==='th'?'โอกาสที่ควรตรวจสอบในพื้นที่':'Market opportunities to validate'}</h3>
            <div className="market-opportunity-checks">
              <div><span>01</span><b>{lang==='th'?'ความต้องการที่ยังไม่ตอบโจทย์':'Unmet customer needs'}</b><p>{lang==='th'?'อ่านรีวิวซ้ำ ๆ เรื่องความสะอาด เครื่องเสีย ความปลอดภัย และเวลาเปิด':'Review recurring comments about cleanliness, machine downtime, safety, and opening hours.'}</p></div>
              <div><span>02</span><b>{lang==='th'?'ราคาและรูปแบบบริการ':'Pricing and service mix'}</b><p>{lang==='th'?'ตรวจราคาซัก/อบจริงและบริการเสริม เช่น ซักอบพับหรือรับส่ง':'Verify wash/dry prices and services such as wash-fold or pickup/delivery.'}</p></div>
              <div><span>03</span><b>{lang==='th'?'ความหนาแน่นและการเข้าถึง':'Competition and accessibility'}</b><p>{lang==='th'?'สำรวจร้านในระยะเดินทางเดียวกัน ที่จอดรถ หอพัก และชุมชนใกล้เคียง':'Map nearby competitors, parking, apartments, and residential demand within the same catchment.'}</p></div>
            </div>
            <div className="market-opportunity-note"><b>{lang==='th'?'ขั้นต่อไปเพื่อประเมินตลาดจริง':'Next step for market validation'}</b><p>{lang==='th'?'เปรียบเทียบหลายพื้นที่ด้วยจำนวนคู่แข่ง ระยะทาง ราคา และการสำรวจลูกค้าในช่วงเวลาต่างกัน ข้อมูล Google Places เพียงอย่างเดียวไม่สามารถบอกจำนวนลูกค้า ยอดขาย หรือกำไรได้':'Compare several areas using competitor distance, verified prices, and customer surveys at different times. Google Places alone cannot estimate customer counts, sales, or profit.'}</p></div>
          </div>}
        </section>}
        {(active==='overview' || active==='opportunities') && <section className="secondary-grid">
          {active==='overview' && <div className="panel price-panel">
            <div className="panel-heading"><div><h2>{t.priceCompare}</h2><p>{t.priceSub}</p></div><button className="select-button">{lang==='th'?'ซัก / อบ':'Wash / Dry'}<ChevronDown size={14}/></button></div>
            {active==='overview' ? <div className="price-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={priceData} barGap={5} margin={{top:8,right:4,left:-20,bottom:0}}><CartesianGrid stroke="#253145" vertical={false}/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#78869c',fontSize:10}} tickMargin={10}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#78869c',fontSize:11}}/><Tooltip contentStyle={{background:'#111c2d',border:'1px solid #29364b',borderRadius:10,color:'#e8eef7'}}/><Bar dataKey="wash" name={lang==='th'?'ซัก':'Wash'} fill="#51d9b1" radius={[4,4,0,0]} barSize={14}/><Bar dataKey="dry" name={lang==='th'?'อบ':'Dry'} fill="#8193ff" radius={[4,4,0,0]} barSize={14}/></BarChart></ResponsiveContainer></div> : <div className="pricing-entry"><p className="live-footnote">{lang==='th'?'Google Places ไม่ได้ส่งราคาซัก/อบมาให้ กรอกราคาที่ตรวจสอบจากร้านจริงเพื่อเปรียบเทียบ ราคาที่กรอกเป็นข้อมูลในหน้านี้เท่านั้น':'Google Places does not provide wash/dry prices. Enter verified prices to compare; entries stay in this page state.'}</p>{realPlaces.length===0 ? <div className="live-empty">{lang==='th'?'ไปที่ “วิเคราะห์คู่แข่ง” แล้วค้นหาร้านจริงก่อน':'Go to Competitor Analysis and search real stores first.'}</div> : selectedForPricing.length===0 ? <div className="live-empty">{lang==='th'?'ยังไม่ได้เลือกร้าน กรุณาไปหน้า “วิเคราะห์คู่แข่ง” แล้วติ๊กเลือกร้าน จากนั้นกด “เปรียบเทียบร้านที่เลือก”':'No stores selected. Select stores in Competitor Analysis, then click Compare selected stores.'}<button className="primary-button" style={{marginTop:12}} onClick={()=>changePage('competitors')}>{lang==='th'?'ไปเลือกคู่แข่ง':'Choose competitors'}</button></div> : <div className="table-wrap live-table-wrap"><table><thead><tr><th>{lang==='th'?'ร้าน':'Store'}</th><th>{lang==='th'?'ซัก (บาท)':'Wash (THB)'}</th><th>{lang==='th'?'อบ (บาท)':'Dry (THB)'}</th></tr></thead><tbody>{comparisonPlaces.map(place=><tr key={place.id}><td>{place.name}</td><td><input type="number" min="0" placeholder="—" value={priceEntries[place.id]?.wash ?? ''} onChange={e=>setPriceEntries(prev=>({...prev,[place.id]:{wash:e.target.value,dry:prev[place.id]?.dry ?? ''}}))}/></td><td><input type="number" min="0" placeholder="—" value={priceEntries[place.id]?.dry ?? ''} onChange={e=>setPriceEntries(prev=>({...prev,[place.id]:{wash:prev[place.id]?.wash ?? '',dry:e.target.value}}))}/></td></tr>)}</tbody></table></div>}{pricedPlaces.length>0 && <div className="live-footnote">{lang==='th'?`บันทึกราคาที่กรอกแล้ว ${pricedPlaces.length} ร้าน`:`Prices entered for ${pricedPlaces.length} stores`}</div>}</div>}
          </div>}
          {active==='overview' && <div className="panel insight-panel" id="opportunities-overview-section">
            <div className="panel-heading"><div className="ai-heading"><div className="ai-icon"><Sparkles size={17}/></div><div><h2>{t.aiTitle}</h2><p>{t.aiLabel}</p></div></div><span className="ai-status">AI</span></div>
            <div className="market-signal-grid">
              <div className="market-signal-card"><span>{lang==='th'?'ร้านที่พบ':'Listings found'}</span><strong>{realPlaces.length}</strong><small>{lang==='th'?'ผลค้นหาจาก Google Places':'Google Places search results'}</small></div>
              <div className="market-signal-card"><span>{lang==='th'?'คะแนนเฉลี่ย':'Average rating'}</span><strong>{averageRating===null?'—':averageRating.toFixed(1)}{averageRating!==null&&<small> / 5</small>}</strong><small>{lang==='th'?`จาก ${ratedPlaces.length} ร้านที่มีคะแนน`:`${ratedPlaces.length} rated listings`}</small></div>
              <div className="market-signal-card"><span>{lang==='th'?'ร้านคะแนน ≤ 4.0':'Listings rated ≤ 4.0'}</span><strong>{lowRatedPlaces.length}</strong><small>{lang==='th'?'จุดเริ่มต้นสำรวจช่องว่างบริการ':'Potential service-research leads'}</small></div>
            </div>
            <div className="market-opportunity-note"><b>{lang==='th'?'วิธีอ่านโอกาสทางตลาด':'How to interpret market opportunity'}</b><p>{lang==='th'?'ใช้จำนวนร้านเพื่อประเมินการแข่งขันเบื้องต้น และใช้คะแนน/รีวิวเพื่อหาเรื่องที่ลูกค้าอาจยังไม่พอใจ เช่น ความสะอาด เวลาเปิด หรือเครื่องเสีย ควรตรวจสอบรีวิวจริงและสำรวจลูกค้าในพื้นที่ก่อนตัดสินใจลงทุน':'Use listing count as a preliminary competition signal and ratings/reviews to investigate unmet service needs such as cleanliness, hours, or machine downtime. Review actual feedback and survey local customers before investing.'}</p></div>
            <div className="insight-body"><div className="insight-badge"><Lightbulb size={15}/>{lang==='th'?'สัญญาณโอกาสจากข้อมูล':'Signals from data'}</div><p>{realPlaces.length===0 ? (lang==='th'?'ยังไม่มีข้อมูลร้านจริง กรุณาไปค้นหาร้านในหน้า “วิเคราะห์คู่แข่ง” ก่อน ระบบจึงจะสรุปสัญญาณตลาดได้':'No live listings yet. Search for stores in Competitor Analysis first to calculate market signals.') : (lang==='th'?`พบร้าน ${realPlaces.length} แห่งจาก Google Places${averageRating===null?'':` คะแนนเฉลี่ย ${averageRating.toFixed(1)} / 5`}. ${lowRatedPlaces.length>0?`มี ${lowRatedPlaces.length} ร้านคะแนนไม่เกิน 4.0 ซึ่งอาจเป็นจุดให้สำรวจคุณภาพบริการเพิ่มเติม`:'ยังไม่พบร้านคะแนนไม่เกิน 4.0 จากข้อมูลที่ได้'}. นี่เป็นเพียงสัญญาณเบื้องต้น ไม่ใช่การยืนยันช่องว่างตลาด`:`Found ${realPlaces.length} Google Places listings${averageRating===null?'':` with an average rating of ${averageRating.toFixed(1)} / 5`}. ${lowRatedPlaces.length>0?`${lowRatedPlaces.length} listings rate 4.0 or below and may warrant service-quality research.`:'No listings rated 4.0 or below in this result set.'} This is an initial signal, not proof of a market gap.`)}</p></div>
            <div className="recommendations"><h3>{t.recommendation}</h3><ul><li><span>01</span>{lang==='th'?'ตรวจสอบรีวิวเชิงลบและปัญหาบริการที่เกิดซ้ำ':'Review recurring negative feedback and service issues'}</li><li><span>02</span>{lang==='th'?'สำรวจราคาซักและอบจากร้านจริง แล้วกรอกในหน้าเปรียบเทียบราคา':'Verify actual wash/dry prices and enter them in Price Comparison'}</li><li><span>03</span>{lang==='th'?'ยืนยันความต้องการลูกค้าก่อนลงทุนหรือปรับโปรโมชั่น':'Validate customer demand before investing or changing promotions'}</li></ul></div>
          </div>}
        </section>}
        {(active==='overview' || active==='reports') && <section className="panel competitor-panel" id="reports-section">
          <div className="panel-heading table-head"><div><h2>{t.tableTitle}</h2><p>{t.tableSub}</p></div><div className="table-actions"><div className="search-box"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/></div><button className="select-button"><Filter size={14}/>{t.filter}</button><button className="text-button" onClick={()=>changePage('competitors')}>{t.viewAll}<ChevronRight size={14}/></button></div></div>
          <div className="table-wrap"><table><thead><tr><th>{t.name}</th><th>{t.distance}</th><th>{t.wash}</th><th>{t.dryer}</th><th>{t.rating}</th><th>{t.status}</th></tr></thead><tbody>{filtered.map((c,i)=><tr key={c.name}><td><div className="store-cell"><div className="store-icon" style={{'--store-color':c.color} as React.CSSProperties}><WashingMachine size={16}/></div><div><b>{c.name}</b><small>{c.area}</small></div></div></td><td>{c.distance}</td><td><b>฿{c.wash}</b></td><td><b>฿{c.dryer}</b></td><td><span className="rating">★ {c.rating}</span></td><td><span className="status-pill"><i/>{t.active}</span></td></tr>)}</tbody></table>{filtered.length===0&&<div className="empty">{lang==='th'?'ไม่พบร้านที่ค้นหา':'No stores found'}</div>}</div>
          <div className="table-footer"><span>{lang==='th'?`แสดง ${filtered.length} จาก 24 ร้าน`:`Showing ${filtered.length} of 24 stores`}</span><button onClick={()=>setQuery('')}>{lang==='th'?'ล้างการค้นหา':'Clear search'}</button></div>
        </section>}
        <footer className="footer"><span>© 2026 LaundryIQ · {lang==='th'?'ระบบวิเคราะห์ตลาดสะดวกซัก':'Laundry market intelligence'}</span><span>{t.demo} <span className="footer-sep">·</span> v1.0.0</span></footer>
      </div>
    </main>
  </div>
}
function Kpi({icon,title,value,unit,trend,positive}:{icon:React.ReactNode,title:string,value:string,unit:string,trend:string,positive:boolean}) {
  return <div className="kpi-card"><div className="kpi-top"><span className="kpi-icon">{icon}</span><span className={`kpi-trend ${positive?'positive':'negative'}`}>{positive?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>} {trend}</span></div><div className="kpi-title">{title}</div><div className="kpi-value">{value}<small>{unit}</small></div></div>
}
export default App
