import { useParams, Link } from "react-router-dom";
import React, {Component, createElement, useEffect, useState} from "react";
import axios from 'axios';
import BASE_URL from "./BASE_URL";
import 'styles/home.css';
import moment from 'moment';
import Slider from 'react-touch-drag-slider';
import { createPortal } from "react-dom";
import Letter from "./Letter";
import LetterItem from "../LetterItem";
import plusImage from "../images/add_card.png";
import Flippy from "react-flippy";
import {FrontSide, BackSide} from "react-flippy";
import styles from '../styles/home.css';

const StorageLetter = () => {

  const { id, year, month } = useParams(); // url의 파라미터로 넘겨져 온 것.
  const curr_user = sessionStorage.getItem('user_id');  // 현재 로그인한 유저
  const [nickname, setNickname] = useState("");
  
  const [letterSavedCnt, setLetterSavedCnt] = useState(0);
  
  const [letterSavedInfo, setLetterSavedInfo] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const [letterList, setLetterList] = useState([]);


  const getLettersFromDB = async () => {
  // (opened = True인) 유저에게 온 편지 닉네임, open_date 받기
      await axios.get(BASE_URL+`/letter/getSavedLettersDetail/${id}/${year}/${month}`)
      .then(response => {
        // console.log(response.data)
        if (response.data == "편지가 없어요") {
          console.log("no letter")
        } else {
          setLetterSavedCnt(response.data.length)
          setLetterSavedInfo(response.data.map(item => {
            return {
              sender: item.author,
              open_date: item.open_date,
              written_date: item.created_date,
              title: item.title,
              text: item.text,
              paper_type: item.paper_type,
              effect_type: item.effect_type,
              sender: item.sender
            };  
          }))
        }
      })
      .catch(error => {
          console.log(error);
      })

      setLoading(false)
  }

  useEffect(()=>{

  
    
    // 유저의 닉네임, 메모 불러오기
    axios.get(BASE_URL+`/account/getUserInfo/${id}`)
      .then(response => {
        setNickname(response.data[0].nickname)
      })
      .catch(error => {
          console.log(error);
      })

    getLettersFromDB()

  }, []);
 
  // console.log("curr_user : "+curr_user);
  // curr_user가 null이라면 아무도 로그인 하지 않은 상태. 아니면 누군가의 id가 저장되어 있음.

  useEffect(()=>{
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryControlsContainer = document.querySelector('.gallery-controls');
    const galleryControls = ['previous', 'add', 'next'];
    const galleryItems = document.querySelectorAll('.gallery-item');

    let curIdx = 0;
    
    class Carousel{
      constructor(container, items, controls) {
        this.carouselContainer = container;
        this.carouselControls = controls;
        this.carouselArray = [...items];
    
      }
    
      // Update css classes for gallery
      updateGallery() {
        this.carouselArray.forEach(el => {
          el.classList.remove('gallery-item-1');
          el.classList.remove('gallery-item-2');
          el.classList.remove('gallery-item-3');
          el.classList.remove('gallery-item-4');
          el.classList.remove('gallery-item-5');
        });
    
        this.carouselArray.slice(0, 5).forEach((el, i) => {
          el.classList.add(`gallery-item-${i+1}`);

        });
      }
    
      // Update the current order of the carouselArray and gallery
      setCurrentState(direction) {
    
        if (direction.className == 'gallery-controls-previous' && curIdx >0) {

          curIdx--;
          // console.log(curIdx)
          this.carouselArray.unshift(this.carouselArray.pop());
        } else if (direction.className == 'gallery-controls-next' && curIdx <this.carouselArray.length-3){
          curIdx++;
          // console.log(curIdx)
          this.carouselArray.push(this.carouselArray.shift());
        }

        this.updateGallery();
      }
    
      setControls() {
        this.carouselControls.forEach(control => {
          galleryControlsContainer.appendChild(document.createElement('button')).className = `gallery-controls-${control}`;
          document.querySelector(`.gallery-controls-${control}`).innerText = control;
        });
      }


      setLetterView(){
        const newItem = document.createElement('img');
        let latestItem = this.carouselArray.length;
        const latestIndex = this.carouselArray.findIndex(item => item.getAttribute('data-index') == this.carouselArray.length)+1;

        latestItem =3;

        for(let j = 0; j <letterList.length; j++){
          this.carouselArray.splice(latestIndex,0,letterList[j]);
          document.querySelector(`[data-index="${latestItem}"]`).after(letterList[j]);
          
          this.updateGallery();
        }
      }
    
    
      // Add a click event listener to trigger setCurrentState method to rearrange carousel
      useControls() {
        const triggers = [...galleryControlsContainer.childNodes];
    
    
        triggers.forEach(control => {
          control.addEventListener('click', e => {
            e.preventDefault();
            const newItem = document.createElement('img');
            let latestItem = this.carouselArray.length;
            const latestIndex = this.carouselArray.findIndex(item => item.getAttribute('data-index') == this.carouselArray.length)+1;
            if (control.className == 'gallery-controls-add') {
              //Add 버튼일 경우
              //ontrols = ['previous', 'add', 'next']
              // Assign the necessary properties for new gallery item
              Object.assign(newItem,{
                className: 'gallery-item',
                src: `http://fakeimg.pl/300/?text=${this.carouselArray.length+1}`
              });
              newItem.setAttribute('data-index', this.carouselArray.length+1);

              
              const letterItem = document.createElement('div');
              //const letterItem = new LetterItem(`밈${this.carouselArray.length+1}`,"날짜",this.carouselArray.length+1);
              //console.log(letterItem);

              Object.assign(letterItem,{
                className: 'gallery-item'
              })

              letterItem.setAttribute('data-index',this.carouselArray.length+1);
              const nickname = document.createElement('span');
              nickname.innerText = `밈${latestItem+1}\n`;
              const dueDate = document.createElement('span');
              dueDate.innerText = `2020.${latestIndex}`;

              letterItem.appendChild(nickname);
              letterItem.appendChild(dueDate);

              latestItem =2;
        
              for(let j = 0; j <letterList.length; j++){
                this.carouselArray.splice(latestIndex,0,letterList[j]);
                document.querySelector(`[data-index="${latestItem}"]`).after(letterList[j]);
                this.updateGallery();
              }
              
    
            } else {
              // 아닐 경우

              this.setCurrentState(control);

            }
    
          });
        });
    
      }
    }
    const exampleCarousel = new Carousel(galleryContainer, galleryItems, galleryControls);
    exampleCarousel.useControls();



    if (!loading) {

      console.log("loading" + loading)
      console.log(letterSavedCnt)
      console.log(letterSavedInfo)

      let j;

      for(j = 0 ; j < letterSavedInfo.length; j++){
        const letter = document.createElement('div');

          Object.assign(letter, {
            className: 'gallery-item'
          });


        letter.setAttribute('data-index', j+4);
        const sender = document.createElement('span');
        const DueDate = document.createElement('span');
        sender.className = "sender_text"
        sender.innerText = letterSavedInfo[j].sender;
        DueDate.innerText = letterSavedInfo[j].open_date;
        DueDate.className = "open_date_text"
        const line = document.createElement('br');

        const front = document.createElement('div');
        front.className = 'letter_front';
        const back = document.createElement('div');
        back.className = 'letter_back';

        front.appendChild(sender);
        front.appendChild(line);
        front.appendChild(DueDate);

        letter.appendChild(front);
        letter.appendChild(back);

        const letterContainer = document.createElement('div');
        letterContainer.className="letterContainer"
        letterContainer.appendChild(front);
        letterContainer.appendChild(back);

        letterContainer.addEventListener('click',click);

        letter.appendChild(letterContainer);

        //letter.appendChild(sender);
        //letter.appendChild(line);
        //letter.appendChild(DueDate);
        //letter.addEventListener('click',click)
        //letter.onClick= click;


        console.log(letter);

        letterList.push(letter);
        //letterList.push(filpCard);
      }


      let i;

      for(i = 0 ; i < letterSavedInfo.length; i++){
        const letter = document.createElement('div');
        if(i==0){
          Object.assign(letter, {
            className: 'gallery-item gallery-item-4'
          });
          
          
        }else if(i==1){
          Object.assign(letter, {
            className: 'gallery-item gallery-item-5'
          });

        }else{
          Object.assign(letter, {
            className: 'gallery-item'
          });
          
        }

        letter.setAttribute('data-index', i+j);
        const sender = document.createElement('span');
        const DueDate = document.createElement('span');
        sender.innerText = letterSavedInfo[i].sender;
        DueDate.innerText = letterSavedInfo[i].open_date;
        DueDate.className = "open_date_text"
        sender.className = "sender_text"
        const line = document.createElement('br');

        const front = document.createElement('div');
        front.className = 'letter_front';
        const back = document.createElement('div');
        back.className = 'letter_back';

        front.appendChild(sender);
        front.appendChild(line);
        front.appendChild(DueDate);

        //편지 내용 불러오기
        const content = document.createElement('div'); //편지 내용 감싸기 위한 div태그
        content.className = "letter_content";
        
        const title = document.createElement('p');
        const text = document.createElement('p');
        // const sender (위에서 이미 정의됨 )
        const written_date = document.createElement('p');

        // 태그에 아이디 추가
        //title.id = "";
        //text.id = "";
        //written_date.id = "";
        
        // 태그 텍스트 설정
        title.innerText = letterSavedInfo[i].title
        text.innerText = letterSavedInfo[i].text
        //sender.innerText 위에서 디비에서 받아왔음
        written_date.innerText = letterSavedInfo[i].written_date.substr(0,10)

        //아까 만들었던 div태그에 자식 요소로 추가 
        content.appendChild(title);
        content.appendChild(text);
        content.appendChild(sender);
        content.appendChild(written_date);



        //div 태그를 div class= letter_back의 자식 요소로 추가
        back.appendChild(content);

        //편지 페이지에 앞 뒤면 자식 요소로 추가
        letter.appendChild(front);
        letter.appendChild(back);

        const letterContainer = document.createElement('div');
        letterContainer.className="letterContainer"
        letterContainer.appendChild(front);
        letterContainer.appendChild(back);

        letterContainer.addEventListener('click',click);

        letter.appendChild(letterContainer);


        letterList.push(letter);
      }



      exampleCarousel.setLetterView();

      // console.log(letterList.length);

    }
    
  }, [loading])

  function click(event) {
    let elem = event.currentTarget;
    if (elem.style.transform == "rotateY(180deg) scale(3)") {
              elem.style.transform = "rotateY(0deg) scale(1.0)";
              

              //opened
          } else {
              elem.style.transform = "rotateY(180deg) scale(3.0)";
              const content = document.getElementsByClassName('letter_content');
              for (let p = 0; p < content.length; p++){
                content[p].style.transform = "scale(0.3)";
              }
          }
      }

  const transparent_style = {
    opacity: 0
  }
  const FlippyStyle = {
    width: "300px",
    height: "300px",
    textAlign: "center",
    color: "#000",
    fontFamily: "sans-serif",
    fontSize: "30px",
    justifyContent: "center"
  }

  if (curr_user == id) {
    return (
      <>
        <div class="title-bar">
          
            <div className="title-holder">
              <span class= "title"><span id="name">{nickname}</span> 님의 {year}년 {month}월 보관함입니다.</span>
            </div>
            
            <div class="title_menu">
              {
                id === curr_user
                ?
                  <span id="welcome">{nickname}님</span>
                :
                  <span id="welcome"
                  onClick={()=>{
                    document.location.href = `/welcome`       //로그인 여부에 따라 다르게
                  }}>로그인/회원가입</span>
              }
              
              <span id="storage"
                onClick={()=>{
                  if (curr_user == id) {
                    document.location.href = `/mypage/${id}` // 유저의 레터스페이스로 이동 (로그인 유저와 같아야 함)
                  } else {
                    alert("자신의 보관함만 열람 가능합니다.")
                  }
                }}>레터스페이스</span>
            </div>
          
        </div>
        
        <div class="contents">
          {/* <p class="stacked_letter_text">쌓인 편지 <span id="before_open_letter">{letterInvalidCnt+letterValidCnt}</span> 개</p> */}
          <p class="unlock_info"><span id="unlocked_letter">{letterSavedCnt}</span>개의 편지가 있어요 !</p>
          <div id= "content_zone" class="gallery">
            <div class="gallery-container" id="container">
              <div style={transparent_style} class="gallery-item gallery-item-1" data-index="1"/>
              <div style={transparent_style} class="gallery-item gallery-item-2" data-index="2"/>
              <img class="gallery-item gallery-item-3" data-index="3" src={plusImage} onClick={()=>{
            document.location.href = `/mypage/${id}/write`}}/>
    
            </div>
            <div class="gallery-controls">
              <button class="gallery-controls-previous">
                "previous"
              </button>
              <button class="gallery-controls-add">
                add
              </button>
              <button class="gallery-controls-next">
                "next"
              </button>
            </div>
          </div>
        </div>
      </>
    
    );

  } else {
    console.log("invalid")
    return (
        <div>삐빅- 잘못된 접근입니다! :(</div>
    )
  }

  
};

export default StorageLetter;