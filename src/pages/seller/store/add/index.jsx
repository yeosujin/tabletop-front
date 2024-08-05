import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components';
import { Dialog, DialogContent, DialogTitle, Button, TextField } from '@mui/material'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { addStoreAPI, isDuplicatedAPI } from '../../../../apis/seller/SellerAPI'

const InputDiv = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
`;

const PreviewContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const PreviewTitle = styled.h3`
    margin-top: 10px;
`;

const ImagePreviewArea = styled.div`
    width: 300px;
    height: 300px;
    padding: 20px;
    border: 1px solid #d1d2cf;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Label = styled.label`
    font-size: 1rem;
    color: black;
    font-weight: bold;
    line-height: 1.25;
    cursor: not-allowed;
    opacity: 0.8;
`;

const InputField = styled.input`
    height: 2rem;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;

    &:focus {
        border: 2px solid #ff9f1c;
        // box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); // 선택적: 포커스 시 그림자 효과
    }
`;

const TextArea = styled.textarea`
  width: 97%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;

    &:focus {
        border: 2px solid #ff9f1c;
    }
`;

const HelperText = styled.label`
    font-size: 1rem;
    color: black;
    font-weight: bold;
    line-height: 1.25;
    cursor: not-allowed;
    opacity: 0.9;
`;

const InputFile = styled.input.attrs({ type: "file" })`
    display: flex;
    height: 2rem;
    width: 700px;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    padding: 0.5rem 0.75rem; /* px-3 py-2 */
    font-size: 0.875rem; /* text-sm */
    color: #9ca3af; /* text-gray-400 */

    &::file-selector-button {
        border: 0;
        background: transparent;
        color: #4b5563;
        font-size: 0.875rem;
        font-weight: 500;
    }
`;

const RadioInputs = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background-color: #EEE;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 300px;
    font-size: 14px;
`;

const Radio = styled.label`
    flex: 1 1 auto;
    text-align: center;
    
    input {
        display: none;
    }
    
    .name {
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border-radius: 0.5rem;
        border: none;
        padding: .5rem 0;
        color: rgba(51, 65, 85, 1);
        transition: all .15s ease-in-out;
    }

    input:checked + .name {
        background-color: #fff;
        font-weight: 600;
    }
`;

const StoreAddModal = ({ open, onSubmit, onClose }) => {
    const initialFormState = {
        name: '',
        storeType: '상시',
        corporateRegistrationNumber: '',
        openDate: '',
        closeDate: '',
        openTime: '',
        closeTime: '',
        notice: '',
        address: '',
        description: '',
        holidays: [],
        image: 'https://via.placeholder.com/140x140?text=No+Image',
    }

    // store type을 설정하는 radio button 값 저장
    const [selectedType, setSelectedType] = useState('상시')
    const [formData, setFormData] = useState(initialFormState)

    const resetForm = () => {
        setFormData(initialFormState)
        setSelectedType('상시')
        setValidated(false)
        // 파일 입력 필드 초기화
        if (document.querySelector('input[type="file"]')) {
            document.querySelector('input[type="file"]').value = ''
        }
    }

    // 사업자 등록번호 검증 관련
    const [validated, setValidated] = useState(false)

    // store type 변경
    const handleTypeChange = (event) => {
        console.log('name and value', event.target.name, event.target.value)
        setSelectedType(event.target.value)
        handleInputChange(event)
    }

    // form의 input 값 변경 시
    const handleInputChange = (event) => {
        // console.log(event.target.name, event.target.value);
        const { name, value } = event.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    // holidays 변경
    const handleHolidaysChange = (event, newHolidays) => {
        setFormData((prevData) => ({
            ...prevData,
            holidays: newHolidays,
        }))
    }

    // 이미지 변경 시
    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                image: URL.createObjectURL(file),
            }))
        }
    }

    // 이미지 삭제 시
    const handleImageDelete = () => {
        setFormData((prevData) => ({
            ...prevData,
            image: null,
        }))
    }

    // 입력된 번호가 10자리 숫자인지 확인
    const checkNumberLength = (num) => {
        return /^\d{10}$/.test(num) ? true : false
    }

    // 사업자등록번호 중복 검사
    const checkDuplicatedNumber = async (num) => {
        const response = await isDuplicatedAPI(num)
        return response.isDuplicated === 'true'
    }

    // 사업자등록번호 유효성 검사
    const validateNumber = async (num) => {
        const url =
            'https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=dykZa6G6kCjn6O0CuStT3mPDTe9Z7gKnGguk6FedQrB9wjbaCVfcZYDzAATjTXczqyg0EA7vDwNKAHIx3vLhFA%3D%3D&returnType=JSON'
        const data = {
            b_no: [num],
        }

        try {
            // 국세청 API 호출
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.data.data[0].b_stt_cd === '01') {
                return true
            } else {
                return false
            }
        } catch (error) {
            alert('유효하지 않은 사업자 등록번호입니다.')
            console.error('validating error: ', error)
        }
    }

    // 사업자등록번호 검사
    const checkCorporateRegistrationNumber = (event) => {
        event.preventDefault()
        const num = formData.corporateRegistrationNumber

        // 입력 값 검증에 성공하면
        if (checkNumberLength(num)) {
            // 중복 검사에 성공하면
            if (!checkDuplicatedNumber(num)) {
                // 유효성 검사에 성공하면
                if (validateNumber(num)) {
                    setValidated(true)
                } else {
                    alert('유효하지 않은 사업자 등록번호입니다.')
                    setValidated(false)
                }
            } else {
                alert('이미 등록된 사업자 등록번호입니다.')
                setValidated(false)
            }
        } else {
            alert('사업자 등록번호는 10자리 숫자여야 합니다.')
            setValidated(false)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        // FormData 객체 생성
        const formDataToSend = new FormData()
        formDataToSend.append(
            'storeData',
            new Blob([JSON.stringify(formData)], { type: 'application/json' })
        )
        const imageFile = document.querySelector('input[type="file"]').files[0]
        if (imageFile) {
            formDataToSend.append('image', imageFile)
        }

        const loginId = localStorage.getItem('id')

        try {
            const response = await addStoreAPI(loginId, formDataToSend)
            console.log(response)
            resetForm() // 폼 초기화
            onSubmit() // 부모 컴포넌트에 제출 완료 알림
            onClose() // 모달 닫기
        } catch (error) {
            alert('가게 등록에 실패했습니다.', error)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>가게 등록</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <PreviewContainer>
                        <ImagePreviewArea>
                            {formData.image && (
                                <PreviewImage
                                    src={formData.image}
                                    alt="미리보기"
                                />
                            )}
                        </ImagePreviewArea>
                        <PreviewTitle>{'<  미리 보기  >'}</PreviewTitle>
                    </PreviewContainer>
                    <InputDiv>
                        <Label>이미지</Label>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <InputFile
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <Button
                                width="100px"
                                variant="contained" 
                                onClick={handleImageDelete}
                            >
                                삭제
                            </Button>
                        </div>
                    </InputDiv>
                    <InputDiv>
                        <Label>가게 유형</Label>
                        <RadioInputs>
                            <Radio>
                                <input
                                    type="radio"
                                    name="storeType"
                                    value="상시"
                                    checked={selectedType === '상시'}
                                    onChange={handleTypeChange}
                                />
                                <span className="name">상시</span>
                            </Radio>
                            <Radio>
                                <input
                                    type="radio"
                                    name="storeType"
                                    value="임시"
                                    checked={selectedType === '임시'}
                                    onChange={handleTypeChange}
                                />
                                <span className="name">임시</span>
                            </Radio>
                        </RadioInputs>
                    </InputDiv>
                    <InputDiv>
                        <Label>상호명</Label>
                        <TextField
                            type="text"
                            label="상호명"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </InputDiv>
                    {selectedType === '상시' && (
                        <InputDiv>
                            <Label>사업자 등록번호</Label>
                            <br />
                            <TextField
                                type="text"
                                label="사업자 등록번호"
                                name="corporateRegistrationNumber"
                                value={formData.corporateRegistrationNumber}
                                onChange={handleInputChange}
                                placeholder="기호(-) 제외하고 10자리 숫자만 입력하세요."
                                required
                            />
                            <Button
                                width="100px" 
                                onClick={checkCorporateRegistrationNumber}>
                                검사
                            </Button>
                            {validated && (
                                <HelperText>
                                    &#10004; 검증되었습니다.
                                </HelperText>
                            )}
                        </InputDiv>
                    )}
                    {selectedType === '임시' && (
                        <>
                            <InputDiv>
                                <Label>개업일</Label>
                                <br />
                                <InputField
                                    type="date"
                                    name="openDate"
                                    value={formData.openDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </InputDiv>
                            <InputDiv>
                                <Label>폐업일</Label>
                                <br />
                                <InputField
                                    type="date"
                                    name="closeDate"
                                    value={formData.closeDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </InputDiv>
                        </>
                    )}
                    <InputDiv>
                        <Label>가게 설명</Label>
                        <br />
                        <TextArea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="5"
                        />
                    </InputDiv>
                    <InputDiv>
                        <Label>가게 주소</Label>
                        <br />
                        <TextField
                            type="text"
                            label="주소"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </InputDiv>
                    <InputDiv>
                        <Label>공지</Label>
                        <br />
                        <TextArea
                            name="notice"
                            value={formData.notice}
                            onChange={handleInputChange}
                            rows="5"
                        />
                    </InputDiv>
                    <InputDiv>
                        <Label>개점시간</Label>
                        <br />
                        <InputField
                            type="time"
                            name="openTime"
                            value={formData.openTime}
                            onChange={handleInputChange}
                            required
                        />
                    </InputDiv>
                    <InputDiv>
                        <Label>폐점시간</Label>
                        <br />
                        <InputField
                            type="time"
                            name="closeTime"
                            value={formData.closeTime}
                            onChange={handleInputChange}
                            required
                        />
                    </InputDiv>
                    <InputDiv>
                        <Label>휴무일</Label>
                        <br />
                        <ToggleButtonGroup
                            value={formData.holidays || []}
                            onChange={handleHolidaysChange}
                            aria-label="day"
                            color="primary"
                            multiple
                        >
                            <ToggleButton value="monday" aria-label="Mon">
                                월
                            </ToggleButton>
                            <ToggleButton value="tuesday" aria-label="Tue">
                                화
                            </ToggleButton>
                            <ToggleButton value="wednesday" aria-label="Wed">
                                수
                            </ToggleButton>
                            <ToggleButton value="thursday" aria-label="Thu">
                                목
                            </ToggleButton>
                            <ToggleButton value="friday" aria-label="Fri">
                                금
                            </ToggleButton>
                            <ToggleButton value="saturday" aria-label="Sat">
                                토
                            </ToggleButton>
                            <ToggleButton value="sunday" aria-label="Sun">
                                일
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </InputDiv>
                    <InputDiv>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            등록
                        </Button>
                    </InputDiv>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default StoreAddModal
