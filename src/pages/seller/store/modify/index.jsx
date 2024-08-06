import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { Dialog, DialogContent, DialogTitle, Button, TextField } from '@mui/material'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import {
    getStoreDetailsAPI,
    modifyStoreAPI,
} from '../../../../apis/seller/SellerAPI'

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
    width: 200px;
    height: 2rem;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    font-family: LINESeedKR-Rg;

    &:focus {
        outline: none;
        border: 2px solid ${({ theme }) => theme.palette.primary.main};
    }
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

    &:focus {
        outline: none;
        border: 2px solid ${({ theme }) => theme.palette.primary.main};
    }

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

const StoreModifyModal = ({ open, onClose, storeId, onSubmit }) => {
    const s3Prefix =
        'https://tabletop-tabletop.s3.ap-northeast-2.amazonaws.com/tabletop/store_image/'
    const [formData, setFormData] = useState({})

    // storeType 변환
    const storeTypeMap = {
        ORDINARY: '상시',
        TEMPORARY: '임시',
    }

    // 기존 store data 가져와서 formData에 저장
    useEffect(() => {
        async function fetchData() {
            if (storeId) {
                const response = await getStoreDetailsAPI(storeId)

                setFormData({
                    image: response.s3Url
                        ? s3Prefix + response.s3Url
                        : 'https://via.placeholder.com/140x140?text=No+Image',
                    name: response.name || '',
                    storeType: storeTypeMap[response.storeType] || '',
                    corporateRegistrationNumber:
                        response.corporateRegistrationNumber || '',
                    openDate: response.openDate || '',
                    closeDate: response.closeDate || '',
                    openTime: response.openTime
                        ? response.openTime.substring(0, 5)
                        : '', // HH:MM 형식으로 변환
                    closeTime: response.closeTime
                        ? response.closeTime.substring(0, 5)
                        : '', // HH:MM 형식으로 변환
                    notice: response.notice || '',
                    address: response.address || '',
                    description: response.description || '',
                    holidays: response.holidays || '',
                })
            }
        }

        fetchData()
    }, [storeId])

    // form의 input 값 변경 시
    const handleInputChange = (event) => {
        // console.log(event.target.name, event.target.value);
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
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
            console.log('URL:', URL.createObjectURL(file))
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

        try {
            await modifyStoreAPI(storeId, formDataToSend)
            onSubmit() // 부모 컴포넌트에 제출 완료 알림
            onClose() // 모달 닫기
        } catch (error) {
            alert('가게 수정에 실패했습니다.', error)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>가게 정보 수정</DialogTitle>
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
                                    src={formData.image || 'https://via.placeholder.com/140x140?text=No+Image'}
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
                                    checked={formData.storeType === '상시'}
                                    onClick={() => {
                                        return false
                                    }}
                                    readOnly
                                />
                                <span className="name">상시</span>
                            </Radio>
                            <Radio>
                                <input
                                    type="radio"
                                    name="storeType"
                                    value="임시"
                                    checked={formData.storeType === '임시'}
                                    onClick={() => {
                                        return false
                                    }}
                                    readOnly
                                />
                                <span className="name">임시</span>
                            </Radio>
                        </RadioInputs>
                    </InputDiv>
                    <InputDiv>
                        <Label>상호명</Label>
                        <TextField
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </InputDiv>
                    {formData.storeType === '상시' && (
                        <InputDiv>
                            <Label>사업자 등록번호</Label>
                            <br />
                            <TextField
                                type="text"
                                name="corporateRegistrationNumber"
                                value={formData.corporateRegistrationNumber || ''}
                                placeholder="기호(-) 제외하고 10자리 숫자만 입력하세요."
                                required
                                readOnly
                            />
                        </InputDiv>
                    )}
                    {formData.storeType === '임시' && (
                        <>
                            <InputDiv>
                                <Label>개업일</Label>
                                <br />
                                <InputField
                                    type="date"
                                    name="openDate"
                                    value={formData.openDate || ''}
                                    onChange={handleInputChange}
                                    required
                                    readOnly
                                />
                            </InputDiv>
                            <InputDiv>
                                <Label>폐업일</Label>
                                <br />
                                <InputField
                                    type="date"
                                    name="closeDate"
                                    value={formData.closeDate || ''}
                                    onChange={handleInputChange}
                                    required
                                    readOnly
                                />
                            </InputDiv>
                        </>
                    )}
                    <InputDiv>
                        <Label>가게 설명</Label>
                        <br />
                        <TextField
                            name="description"
                            value={formData.description || ''}
                            onChange={handleInputChange}
                            rows={5}
                            fullWidth
                            multiline
                        />
                    </InputDiv>
                    <InputDiv>
                        <Label>가게 주소</Label>
                        <br />
                        <TextField
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </InputDiv>
                    <InputDiv>
                        <Label>공지</Label>
                        <br />
                        <TextField
                            name="notice"
                            value={formData.notice || ''}
                            onChange={handleInputChange}
                            rows={5}
                            fullWidth
                            multiline
                        />
                    </InputDiv>
                    <InputDiv>
                        <Label>개점시간</Label>
                        <br />
                        <InputField
                            type="time"
                            name="openTime"
                            value={formData.openTime || ''}
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
                            value={formData.closeTime || ''}
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

export default StoreModifyModal
