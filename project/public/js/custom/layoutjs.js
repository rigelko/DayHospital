const postUl = document.querySelector('#postUl');
const img = document.querySelectorAll('.photoList img');
const photoSlide = document.querySelector('#photoSlide');

//btns
const prevBtn = document.querySelector('.prevBtn');
prevBtn.addEventListener('click',goToPrev);

const nextBtn = document.querySelector('.nextBtn');
nextBtn.addEventListener('click',goToNext);

const post_modal_closeBtn = document.querySelector('#post_modal_closeBtn');
post_modal_closeBtn.addEventListener('mouseover',getCursor);

const img_modal_closeBtn = document.querySelector('#img_modal_closeBtn');
img_modal_closeBtn.addEventListener('mouseover',getCursor);

const moreBtn = document.querySelector('.moreBtn');
moreBtn.addEventListener('mouseover',getCursor);

const plusBtn = document.querySelectorAll('.plusBtn');
plusBtn[0].addEventListener('mouseover',getCursor);
plusBtn[1].addEventListener('mouseover',getCursor);

// modal
const imgModal = document.querySelector('#modal-in-photo');
const postModal = document.querySelector('#modal-in-text');
//const centerGuideModal = document.querySelector('#modal4');
const err_modal = document.querySelector('#err_modal');
const err_close = document.querySelector("#err_close");
err_close.addEventListener('mouseover',getCursor);


// params
let photoCnt; //메인 페이지에 로드될 사진개수 최대 5개
let index = 0; //이미지 슬라이드 용도
let currentImgNum; //모달에 로드된 이미지 id값
let dbImg; //db에저장된 이미지 집합
let dbCnt; //db에저장된 이미지 개수

function init(){
    //추후에 삭제 예정
    resetList();
    axios.get('/layout/postListInit').then((res)=>{
        if(res.status === 200){
            if(res.data["result"] == "success"){ 
                addList(res.data["data"]);
            }
        }
    });
    axios.get('/layout/photoListInit').then((res)=>{
        if(res.status === 200){
            if(res.data["result"] == "success"){ 
                showImg(res.data["data"]);
            }
        }
    });
}   

function addList(item = []){
    item.forEach(function (data) {
        let li = document.createElement('li');
        let span = document.createElement('span');
        let a = document.createElement('a');

        span.style.float = 'right';
        span.addEventListener('mouseover',getCursor);
        
        a.innerText = '자세히 보기';
        
        a.href = 'pmpc_board?' + data.ID;

        span.appendChild(a);
        li.innerText = data.TITLE;
        li.appendChild(span);
        postUl.appendChild(li);

    });
}
//프론트용 데이터 삭제 용도 함수
function resetList(){
    let resetPostUl = document.querySelector('#postUl');
     //이전 데이터 삭제
     while(resetPostUl.hasChildNodes()){
        resetPostUl.removeChild(resetPostUl.firstChild);
    }
}

//li에 초기 사진 저장
function showImg(item = []){
    photoCnt = item.length;
    for(i=0;i<photoCnt;i++){
        img[i].src = item[i].PATH + item[i].FILE_NAME;
        img[i].addEventListener('mouseover',getCursor);
        img[i].addEventListener('click',getImgModal);
        img[i].setAttribute('imgId',i);
        img[i].setAttribute('title',item[i].TITLE);
        img[i].setAttribute('content',item[i].CONTENT);
        let date = date_format(item[i].DATE);
        img[i].setAttribute('date',date);
    }
}

function date_format(data){
    let date;
    date = data.slice(0,10);
    return date;
}

function getImgModal(){
    //console.log(this);
    let modalImg = document.querySelector('#modalImg');
    modalImg.src = this.getAttribute('src');
    currentImgNum = Number(this.getAttribute('imgid'));
    modalImg.setAttribute('imgid',currentImgNum);

    let photo_title = document.querySelector('#modal-in-photo .modal_body h2');
    photo_title.innerText = this.getAttribute('title');
    
    let photo_date = document.querySelector('#modal-in-photo .modal_body h5');
    photo_date.innerText = this.getAttribute('date');
    
    let photo_content = document.querySelector('#modal-in-photo .modalspan');
    photo_content.innerText = this.getAttribute('content');
    
    axios.get('/layout/getImages').then((res)=>{
        if(res.status === 200){
            if(res.data["result"] == "success"){
                dbImg = (res.data["data"]);
                dbCnt = dbImg.length;
            }
        }
    });

    imgModal.style.display = 'block';
}

function goToPrev(){
    let modalImg = document.querySelector('#modalImg');
    currentImgNum = Number(modalImg.getAttribute('imgid'));


    
    if(currentImgNum == 0){
        err_modal.style.display = 'block';
    }
    else{
        let photo_title = document.querySelector('#modal-in-photo .modal_body h2');
        photo_title.innerText = dbImg[currentImgNum - 1].TITLE;
        
        let photo_date = document.querySelector('#modal-in-photo .modal_body h5');
        photo_date.innerText = date_format(dbImg[currentImgNum - 1].DATE);
        
        let photo_content = document.querySelector('#modal-in-photo .modalspan');
        photo_content.innerText = dbImg[currentImgNum - 1].CONTENT;
        
        modalImg.src = dbImg[currentImgNum - 1].PATH + dbImg[currentImgNum - 1].FILE_NAME;

        modalImg.setAttribute('imgid',currentImgNum - 1);
    }
}

function goToNext(){
    let modalImg = document.querySelector('#modalImg');
    currentImgNum = Number(modalImg.getAttribute('imgid'));
    
    if(currentImgNum == dbCnt - 1){
        err_modal.style.display = 'block';
    }
    else{
        let photo_title = document.querySelector('#modal-in-photo .modal_body h2');
        photo_title.innerText = dbImg[currentImgNum + 1].TITLE;
        
        let photo_date = document.querySelector('#modal-in-photo .modal_body h5');
        photo_date.innerText = date_format(dbImg[currentImgNum + 1].DATE);
        
        let photo_content = document.querySelector('#modal-in-photo .modalspan');
        photo_content.innerText = dbImg[currentImgNum + 1].CONTENT;

        modalImg.src = dbImg[currentImgNum + 1].PATH + dbImg[currentImgNum + 1].FILE_NAME;
        modalImg.setAttribute('imgid',currentImgNum + 1);
    }
}

// 사진 슬라이드
setInterval(() => {
    photoSlide.style.transition = 0.8 + "s";
    
    let miniPhoto = document.querySelector('.miniPhoto');
   
    photoSlide.style.transform = "translateX(-" + (miniPhoto.clientWidth * (index + 1)) + "px)";
    index++;
    if(index==photoCnt-1){
        index = -1;
    }
}, 4000);

function getCursor(){
    this.style.cursor = 'pointer';
}

// modal 종료 함수
post_modal_closeBtn.onclick = function(){
    postModal.style.display = 'none';
}

img_modal_closeBtn.onclick = function(){
    imgModal.style.display = 'none';
}

err_close.onclick = function(){
    err_modal.style.display = 'none';
}

window.onclick = function(event){
    if(event.target == imgModal){
        imgModal.style.display = 'none';
    }
}

window.onkeydown = function(){
    if(event.keyCode == 27){
        imgModal.style.display = 'none';
    }
}

init();