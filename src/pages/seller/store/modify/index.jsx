import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const StoreModifyPage = () => {
    const [image, setImage] = useState(null);
    
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [validated, setValidated] = useState(false);

    // store card에서 modify 화면으로 넘어올 때
    const location = useLocation();
    const { storeId } = location.state;

    const [formData, setFormData] = useState({    
        type: '임시',
        image: '',
        registrationNumber: '123456789',
        openDate: '2024-05-01',
        closeDate: '2024-06-05'
    });

    const handleInputChange = (e) => {    
        const { name, value } = e.target;    
        setFormData({...formData, [name]: value});
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

    // 유효성 검사 및 제출 로직 추가        
    const handleSubmit = (e) => {    
        e.preventDefault();      
    };

    const handleOptionClick = (e) => {
        // do nothing
    };

    useEffect(() => {
        // API로부터 데이터 가져오기
        axios.get(`http://localhost:8080/api/store/${storeId}`)
          .then(response => {
            setFormData(response.data);
            // setLoading(false);
          })
          .catch(error => {
            // setError(error);
            // setLoading(false);
          });
      }, [storeId]);
        
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

                <label><input type="radio" value="상시" checked={formData.type === '상시'} onClick={handleOptionClick} />상시</label>        
                <label><input type="radio" value="임시" checked={formData.type === '임시'} onClick={handleOptionClick} />임시</label>
            </div>
            {formData.type === '상시' && (        
                <div>
                    <label>사업자 등록번호: <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} readOnly /></label>        
                </div>      
            )}
            {formData.type === '임시' && (        
                <div>
                    <label>개업일: <input type="date" name="openDate" value={formData.openDate} onChange={handleInputChange} readOnly /></label>
                    <label>폐업일: <input type="date" name="closeDate" value={formData.closeDate} onChange={handleInputChange} readOnly /></label>
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
        
export default StoreModifyPage;
