

let culturalItems = []
let eventFromToday = []
let pageItems = []
let totalResults = 0
let page = 1
let pageSize = 12
let groupSize =5


// const filterUpComingEvents = (items) => {
//   const today = new Date();
//   return items.filter((item) => new Date(item.STRTDATE) >= today);
// };

// const sortStartEvents = (items) => {
//   return items.sort((a, b) => new Date(a.STRTDATE) - new Date(b.STRTDATE));
// };

const filterUpComingEvents = (items) => {
    const today = new Date()
    return items.filter((item)=>new Date(item.STRTDATE) >= today)
}

const sortStartEvents = (items) => {
    return items.sort((a,b)=>new Date(a.STRTDATE) - new Date(b.STRTDATE))
}


    const getPageItems = (items, page) => {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    return items.slice(start, end);
    };

const getEvent = async () => {

    // let url = new URL(`http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/1/1000/`)
    // const response = await fetch(url)

    //⬇️ 하단 await fetch ('/api/getEvents') 배포용 
    const response = await fetch ('/api/getEvents')

    
    
    const data = await response.json()
    totalResults = data.list_total_count
    console.log(data)
    culturalItems = data.culturalEventInfo.row

    
    
   // ✅ 필터 + 정렬 + 저장
    eventFromToday = sortStartEvents(filterUpComingEvents(culturalItems));

    
    renderEvent()
    renderPageHTML()
}






const renderEvent = () => {
        // ✅ 카드 렌더링
        // const startIdx = (page - 1) * pageSize;
        // const endIdx = page * pageSize;
        // const pageItems = filteredItems.slice(startIdx, endIdx);

        const pageItems = getPageItems(eventFromToday, page);

        const culturalEventHTML = pageItems.map((eItems) =>
            `<div class="card col-lg-3 col-md-6 col-sm-12" style="width: 18rem;">
            <img src="${eItems.MAIN_IMG}" class="card-img-top" alt="이미지 없음">
            <div class="card-body">
                <h5 class="card-title">${eItems.TITLE}</h5>
                <p>📅 ${eItems.DATE}</p>
                <p class="card-text">📍 ${eItems.PLACE}</p>
                ${eItems.USE_FEE ? `<p>💰 ${eItems.USE_FEE}</p>` : ''}
                <a href="${eItems.ORG_LINK}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">홈페이지 바로가기</a>
            </div>
            </div>`
        ).join('');

    document.getElementById("cultural-Card-id").innerHTML = culturalEventHTML;
}

const renderPageHTML = () => {
    //totalPage
    let totalPage = totalResults/pageSize
    //groupPage
    let groupPage = Math.ceil(page/groupSize)

    //lastPage
    let lastPage = Math.ceil(groupPage*groupSize)
    if (lastPage < groupPage) {
        groupPage = lastPage 
    }

    // firstPage
    let firstPage = Math.ceil(lastPage -(groupSize-1)) <=0 ? 1 :lastPage -(groupSize-1)


    let paginationHTML = ""
    for (let i=firstPage; i<=lastPage; i++){
        paginationHTML += `<li class="page-item" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }
    document.querySelector(".pagination").innerHTML =  paginationHTML
}

 window.moveToPage = (pageNum) => {
    page = pageNum
    getEvent()
}

getEvent()





// const renderEvent = () => {
//         // ✅ 카드 렌더링
//         // const startIdx = (page - 1) * pageSize;
//         // const endIdx = page * pageSize;
//         // const pageItems = filteredItems.slice(startIdx, endIdx);

//         const culturalEventHTML = culturalItems.map((eItems) =>
//             `<div class="card col-lg-3 col-md-6 col-sm-12" style="width: 18rem;">
//             <img src="${eItems.MAIN_IMG}" class="card-img-top" alt="이미지 없음">
//             <div class="card-body">
//                 <h5 class="card-title">${eItems.TITLE}</h5>
//                 <p>📅 ${formatDateWithDay(eItems.STRTDATE)} ~ ${formatDateWithDay(eItems.END_DATE)}</p>
//                 <p class="card-text">📍 ${eItems.PLACE}</p>
//                 ${eItems.USE_FEE ? `<p>💰 ${eItems.USE_FEE}</p>` : ''}
//                 <a href="${eItems.ORG_LINK}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">홈페이지 바로가기</a>
//             </div>
//             </div>`
//         ).join('');

//     document.getElementById("cultural-Card-id").innerHTML = culturalEventHTML;
// } 