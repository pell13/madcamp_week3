import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import BASE_URL from "./BASE_URL";
import 'styles/write.css';

const Write = () => {

    const { id } = useParams();
    const [sender, setSender] = useState("");
    const [contents, setContents] = useState("");
    const [subject, setSubject] = useState("");
    const [paperType, setpaperType] = useState("");
    const [effectType, setEffectType] = useState("");
    const [error, setError] = useState("");
    const [startDate, setStartDate] = useState(new Date());

    const ExampleCustomInput = React.forwardRef(({ value, onClick }, ref) => (
      <button className="writeInput" onClick={onClick} ref={ref}>
        {value}
      </button>
    ));

    //입력할때 이메일이랑 패스워드 설정
    const onChange = (event) => {
      const {
        target: { name, value },
        } = event;
        if (name === "sender") {
            setSender(value);
        } else if (name === "contents") {
            setContents(value);
        }
        else if (name === "subject") {
          setSubject(value);
      }
    };
    
      //onSubmit 함수다. 버튼이 눌리면 보내는이, 받는이, 작성일, 작성내용이 표시됨.  
    const onSubmit = async (event) => {
      event.preventDefault();
      try {

        console.log(subject, sender, contents, dateToString(startDate));
          //save data to db
          // Example data
          // sender : 보내는이, reciver : 받는이 contents : 여기는 컨텐츠 startDate : 2022-01-14
        axios.post(BASE_URL+"/letter/postLetter", {
          recipient : id,
          author : sender,
          title : "편지왔숑!",
          text : contents,
          open_date : dateToString(startDate)
        }).then(response => {
          if (response.data == "post succeed"){
            // 편지 전송 완료 -> 해당 유저의 레터 스페이스로 보내기
            console.log("편지 전송됨.");
          }
        }).catch(error => {
          console.log("postLetter errror! "+error);
        });
      } catch (error) {
        setError(error.message);
      }
    };

    const dateToString = (date) => {
      return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
    }
    //시간을 년-월-일 형식으로 변환해주는 함수

    // 체크됐는지 확인해서 애니메이션 진행
  const onSelectPaper = (event) => {

    document.querySelectorAll(`div[type=paper]`).forEach(el => el.className = "btn"); //모든걸 버튼으로 바꿔주기!

    event.target.className = "btn_selected" //내가 선택한 건 selected로 바꿔주기!
    const {
      target: { name },
      } = event;
        setpaperType(name);
  };

  const onSelectEffect = (event) => {

    document.querySelectorAll(`div[type=effect]`).forEach(el => el.className = "btn"); //모든걸 버튼으로 바꿔주기!

    event.target.className = "btn_selected" //내가 선택한 건 selected로 바꿔주기!
    const {
      target: { name },
      } = event;
        setEffectType(name);
  };

  

  return (
      <>
      <div class = "write_letter_box">

      <div class = "custom_tab">
        <h3>편지지를 골라요!</h3>
        <div className="btn" type= "paper" name="paper1" onClick={ onSelectPaper}>편지지 1</div>
        <div className="btn" type= "paper" name="paper2" onClick={ onSelectPaper}>편지지 2</div>
        <div className="btn" type= "paper" name="paper3" onClick={ onSelectPaper}>편지지 3</div>
        <div className="btn" type= "paper" name="paper4" onClick={ onSelectPaper}>편지지 4</div>
      </div>

      <div class = "Blank"></div>

      <div class="send_letter">

      <DatePicker
        selected={startDate}
        selectsStart
        value={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="yyyy년 M월 d일에 메시지가 열립니다."
        popperPlacement="left-start"
        customInput={<ExampleCustomInput />}
      />


      <form onSubmit={onSubmit} className="writeContainer">
        

      <input type='text' placeholder="편지 제목을 입력해주세요"
                      name="subject"
                      required
                      value={subject}
                      onChange={onChange}
                      className="writeInput"/>

        <textarea placeholder="내용을 적어주세요"
        type="contents"
        name="contents"
        className="writeInput contentsbox"
        rows="20"
        required
        value={contents}
        onChange={onChange} /> {/* 사용자가 리사이징 못하도록 noresize 적용 : 세로로만 변형 가능 */}

        <input type='text' placeholder="보내는 분 이름을 입력해주세요"
                name="sender"
                className="writeInput"
                required
                value={sender}
                onChange={onChange}/>
        <input
        type="submit"
        className="writeInput writeSubmit"
        value={"보내기"}/>
        </form>
        </div>

        <div class = "Blank"></div>

        <div class = "custom_tab">
          <h3>효과를 골라요!</h3>
          <div className="btn" type= "effect" name="effect1" onClick={onSelectEffect}>효과 1</div>
          <div className="btn" type= "effect" name="effect2" onClick={onSelectEffect}>효과 2</div>
          <div className="btn" type= "effect" name="effect3" onClick={onSelectEffect}>효과 3</div>
          <div className="btn" type= "effect" name="effect4" onClick={onSelectEffect}>효과 4</div>
          </div>

        </div>


    </>
  );
}

export default Write;
