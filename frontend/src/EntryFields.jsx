import React from 'react';
import {Camera} from 'lucide-react';
// Each item type shows only the fields needed to record it. All values use the existing records API.
const configs={
 income:{title:'Nguồn thu nhập',example:'Lương tháng 9',categories:['Lương','Thưởng','Đầu tư','Khác'],amount:true,date:'Ngày nhận',note:'Ghi chú'},
 expense:{title:'Khoản chi',example:'Mua rau ở Netto',categories:['Thực phẩm','Nhà cửa','Đi lại','Sức khỏe','Giáo dục','Khác'],amount:true,date:'Ngày chi',note:'Ghi chú / nơi mua',photo:true},
 claim:{title:'Khoản cần claim',example:'Hoàn tiền khám bác sĩ',categories:['Bảo hiểm','Công ty','Thuế','Khác'],amount:true,date:'Ngày chi / nộp',note:'Mã hồ sơ, hạn nộp và các bước cần làm',photo:true},
 tax:{title:'Khoản thuế',example:'Thuế thu nhập',categories:['Thu nhập','Nhà đất','Khác'],amount:true,date:'Ngày đến hạn',note:'Ghi chú / mã hồ sơ',photo:true},
 saving:{title:'Mục tiêu tiết kiệm',example:'Quỹ du lịch',categories:['Khẩn cấp','Du lịch','Giáo dục','Khác'],amount:true,date:'Ngày mục tiêu',note:'Kế hoạch đạt mục tiêu'},
 event:{title:'Tên lịch hẹn',example:'Họp phụ huynh của Shin',categories:['Gia đình','Công việc','Trường học','Sức khỏe','Du lịch'],date:'Ngày diễn ra',time:true,note:'Địa điểm và ghi chú'},
 health:{title:'Chỉ số / nội dung theo dõi',example:'Chiều cao của Shin',categories:['Tăng trưởng','Giấc ngủ','Stress','Huyết áp','Nhịp tim','Xét nghiệm máu','Tuổi sinh học','Khác'],quantity:'Giá trị đo',unit:'Đơn vị (cm, kg, giờ, bpm…)',date:'Ngày đo',note:'Bối cảnh đo / kết quả / ghi chú',photo:true},
 food:{title:'Tên thực phẩm',example:'Thịt lợn băm',categories:['Đồ khô','Thịt cá đông lạnh','Rau củ','Gia vị','Đồ uống','Khác'],quantity:'Số lượng còn',unit:'Đơn vị (kg, gói, hộp…)',date:'Hạn dùng',note:'Vị trí cất / nơi mua',photo:true},
 meal:{title:'Tên món nhà hay ăn',example:'Bò hầm khoai tây',categories:['Bữa sáng','Bữa trưa','Bữa tối','Ăn nhẹ'],note:'Nguyên liệu (cách nhau bằng dấu phẩy)',photo:true},
 wardrobe:{title:'Tên món đồ',example:'Áo len màu kem',categories:['Quần áo','Giày dép','Mỹ phẩm','Chăm sóc tóc','Phụ kiện'],quantity:'Số lượng',unit:'Đơn vị',note:'Size, màu, vị trí cất',photo:true},
 idea:{title:'Tên concept phối đồ',example:'Đi dạo mùa thu',categories:['Công sở','Đi chơi','Dự tiệc','Khác'],note:'Các món phối cùng / link tham khảo',photo:true},
 household:{title:'Tên đồ trong nhà',example:'Giấy vệ sinh',categories:['Đồ vệ sinh','Dụng cụ','Nội thất','Điện tử','Khác'],quantity:'Số lượng còn',unit:'Đơn vị (cái, gói…)',note:'Vị trí cất / ghi chú',photo:true},
 shopping:{title:'Món cần mua',example:'Dầu gội',categories:['Thực phẩm','Vệ sinh','Mỹ phẩm','Đồ trong nhà','Khác'],quantity:'Số lượng cần',unit:'Đơn vị',date:'Ngày cần mua',note:'Cửa hàng / giá tham khảo'},
 task:{title:'Việc cần làm',example:'Đặt lịch nha sĩ',categories:['Cá nhân','Gia đình','Nhà cửa','Khác'],date:'Hạn hoàn thành',note:'Chi tiết cần nhớ'},
 wishlist:{title:'Điều mong muốn',example:'Chuyến đi Paris',categories:['Mua sắm','Du lịch','Muốn làm'],amount:true,date:'Thời điểm dự kiến',note:'Lý do / link tham khảo'}
};
function Field({title,children}){return <label className="field"><span>{title}</span>{children}</label>}
export default function EntryFields({form,setForm,people,labels,tr,upload,busy}){
 const config=configs[form.kind]||configs.task,change=(key,value)=>setForm(x=>({...x,[key]:value}));
 return <><Field title={tr('Loại mục')}><select value={form.kind} onChange={e=>setForm({kind:e.target.value,title:'',person:form.person,category:'',amount:'',quantity:'',unit:'',date:new Date().toISOString().slice(0,10),time:'09:00',note:'',image_key:''})}>{Object.entries(labels).filter(([kind])=>kind!=='diary').map(([kind,label])=><option key={kind} value={kind}>{tr(label)}</option>)}</select></Field>
 <Field title={tr(config.title)+' *'}><input required maxLength="180" value={form.title} onChange={e=>change('title',e.target.value)} placeholder={tr(config.example)}/></Field>
 <div className="form-row"><Field title={tr('Người')}><select value={form.person} onChange={e=>change('person',e.target.value)}>{people.map(x=><option key={x} value={x}>{tr(x)}</option>)}</select></Field><Field title={tr('Nhóm / loại')}><><input list={'categories-'+form.kind} maxLength="80" value={form.category} onChange={e=>change('category',e.target.value)} placeholder={tr(config.categories?.[0]||'')}/><datalist id={'categories-'+form.kind}>{config.categories?.map(c=><option key={c} value={tr(c)}/>)}</datalist></></Field></div>
 <div className="form-row"><Field title={tr(config.date||'Ngày')}><input type="date" value={form.date} onChange={e=>change('date',e.target.value)}/></Field>{config.amount&&<Field title={tr('Số tiền (DKK)')}><input type="number" min="0" step="0.01" value={form.amount} onChange={e=>change('amount',e.target.value)}/></Field>}{config.time&&<Field title={tr('Giờ bắt đầu')}><input type="time" value={form.time} onChange={e=>change('time',e.target.value)}/></Field>}</div>
 {config.quantity&&<div className="form-row"><Field title={tr(config.quantity)}><input type="number" min="0" step="0.01" value={form.quantity} onChange={e=>change('quantity',e.target.value)}/></Field><Field title={tr(config.unit)}><input maxLength="30" value={form.unit} onChange={e=>change('unit',e.target.value)} placeholder={tr(config.unit)}/></Field></div>}
 <Field title={tr(config.note)}><textarea rows="3" maxLength="2000" value={form.note} onChange={e=>change('note',e.target.value)} placeholder={form.kind==='meal'?tr('Ví dụ: thịt bò, cà rốt, khoai tây'):tr('Chi tiết cần nhớ')}/></Field>
 {config.photo&&<label className="upload"><Camera size={19}/>{tr(form.image_key?'Ảnh đã tải lên · thay ảnh':'Đính ảnh (JPEG, PNG, WebP)')}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>e.target.files?.[0]&&upload(e.target.files[0])}/></label>}</>
}
