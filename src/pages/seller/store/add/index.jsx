import React, { useState } from 'react';
import axios from 'axios';

const StoreAddPage = () => {
    // store type을 설정하는 radio button 값 저장
    const [selectedType, setSelectedType] = useState('상시');

    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        corpRegistrationNumber: '',
        notice: '',
        discription: '',
        open_date: '',
        close_date: '',
        open_time: '',
        close_time: ''
    });

    // 사업자 등록번호 검증 관련
    // const [isDuplicated, setIsDuplicated] = useState(true);
    // const [isValid, setIsValid] = useState(false);
    const [validated, setValidated] = useState(false);

    // store type 변경
    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    // form의 input 값 변경 시
    const handleInputChange = (event) => {    
        const { name, value } = event.target;
        setFormData({...formData, [name]: value});
    };

    // 이미지 변경 시
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    
    // 이미지 삭제 시
    const handleImageDelete = () => {
        setImage(null);
    };

    // 입력된 번호가 10자리 숫자인지 확인
    const checkNumberLength = (num) => {
        return (/^\d{10}$/.test(num)) ? true : false
    };

    // 사업자등록번호 중복 검사
    const checkDuplicatedNumber = (num) => {
        // store
        fetch(`http://localhost:8080/api/store/${num}`)
            .then(response => {
                const data = response.json()
                return data.isDuplicated
            })
            .catch(error => {
                console.error('Error validating number(1):', error);
            });
        
    };

    // 사업자등록번호 유효성 검사
    const validateNumber = async (num) => {
        // num = formData.corpRegistrationNumber;
        const url = 'https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=dykZa6G6kCjn6O0CuStT3mPDTe9Z7gKnGguk6FedQrB9wjbaCVfcZYDzAATjTXczqyg0EA7vDwNKAHIx3vLhFA%3D%3D&returnType=JSON';
        const data = {
            b_no: [num]
        };
        
        try {
            // 국세청 API 호출
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(response.data.data[0].b_stt_cd);
            if(response.data.data[0].b_stt_cd === '01') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            alert('유효하지 않은 사업자 등록번호입니다.');
            console.error('validating error: ', error);
        }        
    };

    // 사업자등록번호 검사
    const checkCorpRegistrationNumber = () => {
        const num = formData.corpRegistrationNumber;

        // 입력 값 검증에 성공하면
        if (checkNumberLength(num)) {
            // 중복 검사에 성공하면
            if(checkDuplicatedNumber(num)) {
                // 유효성 검사에 성공하면
                if(validateNumber(num)) {
                    setValidated(true);
                } else {
                    alert('유효하지 않은 사업자 등록번호입니다.');
                    setValidated(false);
                }
            } else {
                alert('이미 등록된 사업자 등록번호입니다.');
                setValidated(false);
            }
        } else {
            alert('사업자 등록번호는 10자리 숫자여야 합니다.');
            setValidated(false);
        }
    };

    const handleSubmit = (e) => {    
        e.preventDefault();      
        // 제출 로직 추가        
    };
        
    return (
        <form onSubmit={handleSubmit}>
            {image && (
                <div className="image-preview">
                    <img src={URL.createObjectURL(image)} alt="미리보기" width="100" />
                </div>
            )}
            <div>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button type="button" onClick={() => handleImageDelete()}>삭제</button>
            </div>
            <div>
                <label>이름</label><br />
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>        
                <input type="radio" name="storeType" value="상시" checked={selectedType === '상시'} onChange={handleTypeChange} />
                <label>상시</label>
                <input type="radio" name="storeType" value="임시" checked={selectedType === '임시'} onChange={handleTypeChange} />
                <label>임시</label>
            </div>
            {selectedType === '상시' && (       
                <div>
                    <label>사업자 등록번호</label>
                    <input type="text" name="corpRegistrationNumber" value={formData.corpRegistrationNumber} onChange={handleInputChange} placeholder="'-'없이 10자리 숫자만 입력하세요." required />
                    <button onClick={validateNumber}>test</button>
                    <button onClick={checkCorpRegistrationNumber}>검사</button>
                    {validated && (
                        <>
                            <span className="checkmark">&#10004;</span>
                            <div className="tooltip">검증되었습니다.</div>
                        </>
                    )}
                </div>
            )}
            {selectedType === '임시' && (
                <div>
                    <label>개업일</label><br />
                    <input type="date" name="openDate" value={formData.openDate} onChange={handleInputChange} required /><br />
                    <label>폐업일</label><br />
                    <input type="date" name="closeDate" value={formData.closeDate} onChange={handleInputChange} required />
                </div>
            )}
            <div>
                <label>가게 설명</label><br />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="5"
                    cols="100"
                />
            </div>            
            <div>
                <label>가게 주소</label><br />
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
            </div>
            <div>
                <label>공지</label><br />
                <textarea
                    name="notice"
                    value={formData.notice}
                    onChange={handleInputChange}
                    rows="5"
                    cols="100"
                />
            </div>
            <div>
                <label>개점시간</label><br />
                <input type="time" value={formData.open_time} onChange={handleInputChange} required />
            </div>
            <div>
                <label>폐점시간</label><br />
                <input type="time" value={formData.close_time} onChange={handleInputChange} required />
            </div>
            <button type="submit">등록</button>
        </form>
    );
};

export default StoreAddPage;
