import React, { useState } from 'react';

const StoreAddPage = () => {
    // store type을 설정하는 radio button 값 저장
    const [selectedOption, setSelectedOption] = useState('');

    const [image, setImage] = useState(null);
    
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [validated, setValidated] = useState(false);

    const [formData, setFormData] = useState({    businessNumber: '',    openingDate: '',    closingDate: ''  });


    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };
    const handleInputChange = (e) => {    
        const { name, value } = e.target;    
        setFormData({      ...formData,      [name]: value    });  
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
        setImage(file);
        }
    };
    
      const handleImageDelete = () => {
        setImage(null);
      };

      const validateNumber = () => {
        // 입력된 번호가 10자리 숫자인지 확인
        if (/^\d{10}$/.test(formData.registrationNumber)) {
          // 외부 API를 호출하여 번호를 검증합니다 (여기서는 모의 API를 사용합니다)
          fetch(`https://api.example.com/validate?number=${registrationNumber}`)
            .then(response => response.json())
            .then(data => {
                if(data.valie = '01') setIsValid(data.valid);
              setValidated(true);
            })
            .catch(error => {
              console.error('Error validating number:', error);
              setIsValid(false);
              setValidated(true);
            });
        } else {
          alert('사업자 등록번호는 10자리 숫자여야 합니다.');
          setIsValid(false);
          setValidated(false);
        }
      };

    // 유효성 검사 및 제출 로직 추가        
    const handleSubmit = (e) => {    
        e.preventDefault();      
    };
        
    return (
        <form onSubmit={handleSubmit}>
            {image && (
                <div className="image-preview">
                    <img src={URL.createObjectURL(image)} alt="Preview" width="100" />
                </div>
            )}
            <div>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button type="button" onClick={() => handleImageDelete()}>삭제</button>
            </div>
            <div>
                <label>이름 </label><br />
                <input type="text" value={formData.name} onChange={handleInputChange} />
            </div>
            <div>        

                <label><input type="radio" value="상시" checked={selectedOption === '상시'} onChange={handleOptionChange} />상시</label>        
                <label><input type="radio" value="임시" checked={selectedOption === '임시'} onChange={handleOptionChange} />임시</label>
            </div>
            {selectedOption === '상시' && (        
                <div>
                    <label>사업자 등록번호: <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} required /></label>        
                    <button onClick={validateNumber}>검증</button>
                    {validated && isValid && (
                        <>
                            <span className="checkmark">&#10004;</span>
                            <div className="tooltip">검증되었습니다.</div>
                        </>
                    )}
                </div>      
            )}
            {selectedOption === '임시' && (
                <div>
                    <label>개업일: <input type="date" name="openDate" value={formData.openDate} onChange={handleInputChange} required /></label>
                    <label>폐업일: <input type="date" name="closeDate" value={formData.closeDate} onChange={handleInputChange} required /></label>
                </div>
            )}
            <div>
                <label>가게 설명 </label><br />
                <textarea
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="5"
                    cols="40"
                />
            </div>
            
            <div>
                <label>가게 주소 </label><br />
                <input type="text" value={formData.address} onChange={handleInputChange} />
            </div>
            <div>
                <label>공지 </label><br />
                <textarea
                    value={formData.notice}
                    onChange={handleInputChange}
                    rows="5"
                    cols="40"
                />
            </div>
            <div>
                <label>개점시간 </label><br />
                <input type="time" value={formData.open_time} onChange={handleInputChange} />
            </div>
            <div>
                <label>폐점시간 </label><br />
                <input type="time" value={formData.close_time} onChange={handleInputChange} />
            </div>
            <button type="submit">제출</button>    
        </form>  
    );
};
        
export default StoreAddPage;
