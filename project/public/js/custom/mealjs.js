//dynamic add elements
const tbodyPC = document.querySelector('.pmpcTb tbody');
const tbodyMobile = document.querySelector('.mobileTb tbody');

const pcPageBtns = document.querySelector('.pcPageBtns');
const mobilePageBtns = document.querySelector('.mobilePageBtns');

//btns
const searchBtn = document.querySelector('#searchBtn');
searchBtn.addEventListener("click",search);

//params
let pages;
let pcCurrentPage;
let mobileCurrentPage;

//DB상에 저장된 내용 모두 가져오기
function init(){
    resetList();

    axios.get('/meal/createBtns').then((res)=>{
        if(res.status === 200){
            if(res.data["result"] == "success"){ 
                    createBtns(res.data["data"]);
                    mobileCreateBtns(res.data["data"]);
            }
        }
    });
    axios.get('/meal/init').then((res)=>{
        if(res.status === 200){
            if(res.data["result"] == "success"){ 
                addList(res.data["data"]);
                addListMobile(res.data["data"]);
            }
        }
    });
}

//페이지 버튼
// PC page btn
function createBtns(item = []){
    resetBtns();
    if(item.length!=0){
        if(item.length%8==0){
            pages = parseInt(item.length/8);
        }
        else pages = parseInt(item.length/8 + 1);
        let prevBtn = document.createElement('button');
        let nextBtn = document.createElement('button');
        
        prevBtn.classList.add('prevBtn','pc');
        prevBtn.innerText = '←';
        prevBtn.addEventListener('click',goToPrev);
        pcPageBtns.appendChild(prevBtn);
    
        for(i=1;i<=pages;i++){
            let pageButton = document.createElement('button');
            pageButton.classList.add('pageButton','pc');
    
            if(i==1){
                pageButton.classList.add('current');
                pcCurrentPage = pageButton;
            }
            else {
                pageButton.classList.remove('current');
                pageButton.classList.add('notCurrent');
            }
            pageButton.innerText = i;
            pageButton.value = i;
            pageButton.addEventListener('click',deleteAndGet);
            pcPageBtns.appendChild(pageButton);
        }
        nextBtn.classList.add('nextBtn','pc');
    
        nextBtn.innerText = '→';
        nextBtn.addEventListener('click',goToNext);
        pcPageBtns.appendChild(nextBtn);
    }
}

// Mobile page btn
function mobileCreateBtns(item = []){
    mobileResetBtns();
    if(item.length!=0){
        if(item.length%8==0){
            pages = parseInt(item.length/8);
        }
        else pages = parseInt(item.length/8 + 1);
        let prevBtn = document.createElement('button');
        let nextBtn = document.createElement('button');
        
        prevBtn.classList.add('prevBtn','mobile');
    
        prevBtn.innerText = '←';
        prevBtn.addEventListener('click',goToPrev);
    
        mobilePageBtns.appendChild(prevBtn);
    
        for(i=1;i<=pages;i++){
            let pageButton = document.createElement('button');
            pageButton.classList.add('pageButton','mobile');
    
            if(i==1){
                pageButton.classList.add('current');
                mobileCurrentPage = pageButton;
            }
            else {
                pageButton.classList.remove('current');
                pageButton.classList.add('notCurrent');
            }
            pageButton.innerText = i;
            pageButton.value = i;
            pageButton.addEventListener('click',deleteAndGet);
            mobilePageBtns.appendChild(pageButton);
        }
        nextBtn.classList.add('nextBtn','mobile');
        nextBtn.innerText = '→';
        nextBtn.addEventListener('click',goToNext);
        mobilePageBtns.appendChild(nextBtn);
    }
    
}

function createSearchedBtnsPC(item = []){
    resetBtns();
    if(item.length!=0){
        if(item.length%8==0){
            pages = parseInt(item.length/8);
        }
        else pages = parseInt(item.length/8 + 1);
        let nextBtn = document.createElement('button');
        let prevBtn = document.createElement('button');
        
        prevBtn.classList.add('prevBtn','searchedPC');
        prevBtn.innerText = '←';
        prevBtn.addEventListener('click',goToPrev);
        pcPageBtns.appendChild(prevBtn);
    
        for(i=1;i<=pages;i++){
            let pageButton = document.createElement('button');
            pageButton.classList.add('pageButton','searchedPC');
            if(i==1){
                pageButton.classList.add('current');
                pcCurrentPage = pageButton;
            }
            else {
                pageButton.classList.remove('Current');
                pageButton.classList.add('notCurrent');
            }
            pageButton.innerText = i;
            pageButton.value = i;
            pageButton.addEventListener('click',searchedDeleteAndGet);
            pcPageBtns.appendChild(pageButton);
        }
        
        nextBtn.classList.add('nextBtn','searchedPC');
        nextBtn.innerText = '→';
        nextBtn.addEventListener('click',goToNext);
        pcPageBtns.appendChild(nextBtn);
    }
}

function createSearchedBtnsMobile(item = []){
    mobileResetBtns();
    
    if(item.length!=0){
        if(item.length%8==0){
            pages = parseInt(item.length/8);
        }
        else pages = parseInt(item.length/8 + 1);
        let nextBtn = document.createElement('button');
        let prevBtn = document.createElement('button');
        
        prevBtn.classList.add('prevBtn','searchedMobile');
        prevBtn.innerText = '←';
        prevBtn.addEventListener('click',goToPrev);
        mobilePageBtns.appendChild(prevBtn);
    
        for(i=1;i<=pages;i++){
            let pageButton = document.createElement('button');
            pageButton.classList.add('pageButton','searchedMobile');
            if(i==1){
                pageButton.classList.add('current');
                mobileCurrentPage = pageButton;
            }
            else {
                pageButton.classList.remove('Current');
                pageButton.classList.add('notCurrent');
            }
            pageButton.innerText = i;
            pageButton.value = i;
            pageButton.addEventListener('click',searchedDeleteAndGet);
            mobilePageBtns.appendChild(pageButton);
        }
        
        nextBtn.classList.add('nextBtn','searchedMobile');
        nextBtn.innerText = '→';
        nextBtn.addEventListener('click',goToNext);
        mobilePageBtns.appendChild(nextBtn);
    }
}


function goToPrev(){
    if(pcCurrentPage.value != 1 && mobileCurrentPage.value != 1){
        resetList();

        pcCurrentPage.classList.remove('current');
        pcCurrentPage.classList.add('notCurrent');
        mobileCurrentPage.classList.remove('current');
        mobileCurrentPage.classList.add('notCurrent');
        
        pcCurrentPage = pcCurrentPage.previousSibling;
        mobileCurrentPage = mobileCurrentPage.previousSibling;
        
        pcCurrentPage.classList.remove('notCurrent');
        mobileCurrentPage.classList.remove('notCurrent');
        pcCurrentPage.classList.add('current');
        mobileCurrentPage.classList.add('current');

        page_num = pcCurrentPage.value;
        axios.get('/meal/page_num', { params :{
            page_num : page_num
        }}).then((res)=>{
        if(res.status === 200){
            if(res.data["result"] == "success"){ 
                addList(res.data["data"]);
                addListMobile(res.data["data"]);
            }
        }
    });
    }
}
function goToNext(){
    if(pcCurrentPage.value != pages && mobileCurrentPage.value != pages){
        resetList();
        pcCurrentPage.classList.remove('current');
        pcCurrentPage.classList.add('notCurrent');
        mobileCurrentPage.classList.remove('current');
        mobileCurrentPage.classList.add('notCurrent');
        
        pcCurrentPage = pcCurrentPage.nextSibling;
        mobileCurrentPage = mobileCurrentPage.nextSibling;
        
        pcCurrentPage.classList.remove('notCurrent');
        mobileCurrentPage.classList.remove('notCurrent');
        pcCurrentPage.classList.add('current');
        mobileCurrentPage.classList.add('current');

        page_num = pcCurrentPage.value;
        axios.get('/pmpc/page_num', { params :{
            page_num : page_num
        }}).then((res)=>{
        if(res.status === 200){
            if(res.data["result"] == "success"){ 
                addList(res.data["data"]);
                addListMobile(res.data["data"]);
            }
        }
    });
    }
}

//게시글 검색
function search(){
    let target = document.querySelector('#selectBy');
    let searchText = document.querySelector('#searchText').value;
    
    let otn = target.options[target.selectedIndex].value;
    
    axios.get('/meal/selectData', {params: {
        value : otn,
        text : searchText
        }
      }).then((res)=>{
        if(res.status === 200){
            if(res.data['result'] == "success"){
                if(res.data['data'] == 'init'){
                    init();
                }
                else showSearchedInit(res.data['data']);                
            }
        }
    });
}

// 검색된 고객정보 출력
function showSearchedInit(item = []){
    createSearchedBtnsPC(item);
    createSearchedBtnsMobile(item);
    
    //이전 데이터 삭제
    resetList();
    //이후 데이터 출력
    for(i=0;i<12;i++){
        if(item[i]==null)break;
        let tr = document.createElement('tr');
        let tdId = document.createElement('td');
        let tdTitle = document.createElement('td');
        let tdDate = document.createElement('td');
        let url = document.createElement('a');
        url.innerText = item[i].TITLE;        

        tdId.innerText = item[i].ID;
        tdDate.innerText = date_format(item[i].DATE);

        url.href = 'meal_board?' + item[i].ID;
        tdTitle.appendChild(url);
        tr.appendChild(tdId);
        tr.appendChild(tdTitle);
        tr.appendChild(tdDate);
        
        tdTitle.addEventListener('mouseover', getCursor);

        tbodyPC.appendChild(tr);
    }
    for(i=0;i<12;i++){
        if(item[i]==null)break;
        let tr = document.createElement('tr');
        let tdId = document.createElement('td');
        let tdTitle = document.createElement('td');
        let tdDate = document.createElement('td');
        let url = document.createElement('a');
        url.innerText = item[i].TITLE;        

        tdId.innerText = item[i].ID;
        tdDate.innerText = date_format(item[i].DATE);

        url.href = 'meal_board?' + item[i].ID;
        tdTitle.appendChild(url);
        tr.appendChild(tdId);
        tr.appendChild(tdTitle);
        tr.appendChild(tdDate);
        
        tdTitle.addEventListener('mouseover', getCursor);

        tbodyMobile.appendChild(tr);
    }
}

//해당 페이지에 로드할 리스트들(게시글)
function deleteAndGet(){
    pcCurrentPage.classList.remove('current');
    mobileCurrentPage.classList.remove('current');
    pcCurrentPage.classList.add('notCurrent');
    mobileCurrentPage.classList.add('notCurrent');
    
    let page_num = this.value;
    this.classList.remove('notCurrent');
    this.classList.add('current');
    pcCurrentPage = this;
    mobileCurrentPage = this;

    //이전 데이터 삭제
    resetList();

    //이후 데이터 출력 위해 db 호출
        axios.get('/meal/page_num', { params:{
            page_num: page_num
        }}).then((res)=>{
            if(res.status === 200){
                if(res.data["result"] == "success"){ 
                    addList(res.data["data"]);
                    addListMobile(res.data["data"]);
                }
            }
        });
}

//해당 페이지에 로드할 검색된 리스트들(게시글)
function searchedDeleteAndGet(){
    pcCurrentPage.classList.remove('current');
    mobileCurrentPage.classList.remove('current');
    pcCurrentPage.classList.add('notCurrent');
    mobileCurrentPage.classList.add('notCurrent');

    let page_num = this.value;
    this.classList.remove('notCurrent');
    this.classList.add('current');
    pcCurrentPage = this;
    mobileCurrentPage = this;

    let target = document.querySelector('#selectBy');
    let searchText = document.querySelector('#searchText').value;
    
    let otn = target.options[target.selectedIndex].value;
    
    //이전 데이터 삭제
    resetList();
    
    //이후 데이터 출력 위해 db 호출
    axios.get('/meal/selectData_page_num', {params:{
        page_num: page_num,
        value: otn,
        text: searchText
    }}).then((res)=>{
        if(res.status === 200){
            if(res.data["result"] == "success"){
                    if(res.data['data']=='init'){
                        resetList();
                        init();
                    }
                    else {
                        addList(res.data['data']);           
                        addListMobile(res.data["data"]);
                }
            }
        }
    }); 
}

//table에 추가할 공지사항 list 함수
function addList(item = []){
    
    item.forEach(function(data){
        let tr = document.createElement('tr');
        let tdId = document.createElement('td');
        let tdTitle = document.createElement('td');
        let tdDate = document.createElement('td');
        let url = document.createElement('a');
        url.innerText = data.TITLE;        

        tdId.innerText = data.ID;
        tdDate.innerText = date_format(data.DATE);

        url.href = 'meal_board?' + data.ID;
        tdTitle.appendChild(url);
        tr.appendChild(tdId);
        tr.appendChild(tdTitle);
        tr.appendChild(tdDate);
        
        tdTitle.addEventListener('mouseover', getCursor);

        tbodyPC.appendChild(tr);
    });
}

function addListMobile(item = []){
    
    item.forEach(function(data){
        let tr = document.createElement('tr');
        let tdId = document.createElement('td');
        let tdTitle = document.createElement('td');
        let tdDate = document.createElement('td');
        
        let url = document.createElement('a');
        url.innerText = data.TITLE;        

        tdId.innerText = data.ID;
        tdDate.innerText = date_format(data.DATE);

        url.href = 'meal_board?' + data.ID;
        tdTitle.appendChild(url);
        tr.appendChild(tdId);
        tr.appendChild(tdTitle);
        tr.appendChild(tdDate);
        
        tdTitle.addEventListener('mouseover', getCursor);

        tbodyMobile.appendChild(tr);
    });
}

function date_format(data){
    let date;
    date = data.slice(0,10);
    return date;
}

//table 리셋 함수
function resetList(){
    while(tbodyPC.hasChildNodes()){
        tbodyPC.removeChild(tbodyPC.firstChild);
    }
    while(tbodyMobile.hasChildNodes()){
        tbodyMobile.removeChild(tbodyMobile.firstChild);
    }
}

//버튼 리셋 함수
//PC 버전만
function resetBtns(){
    let pageBtns = document.querySelector('.pcPageBtns');
    while(pageBtns.hasChildNodes()){
        pageBtns.removeChild(pageBtns.firstChild);
    }
}
//Mobile버전
function mobileResetBtns(){
    let pageBtns = document.querySelector('.mobilePageBtns');
    while(pageBtns.hasChildNodes()){
        pageBtns.removeChild(pageBtns.firstChild);
    }
}

function getCursor(){
    this.style.cursor = 'pointer';
 }

// 엔터키 입력
function pressKey(){
    if(window.event.keyCode == 13){
            search();
    }
}
init();