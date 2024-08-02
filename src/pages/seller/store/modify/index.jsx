import React, { useEffect, useState } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import {
    getStoreDetailsAPI,
    modifyStoreAPI,
} from '../../../../apis/seller/SellerAPI'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

const StoreModifyModal = ({ open, onClose, storeId, onSubmit }) => {
    const s3Prefix =
        'https://tabletop-tabletop.s3.ap-northeast-2.amazonaws.com/tabletop/'
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
            fetchData()
        }
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
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    {formData.image && (
                        <div className="image-preview">
                            <img
                                src={formData.image || ''}
                                alt="미리보기"
                                width="100"
                            />
                        </div>
                    )}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <button
                            type="button"
                            onClick={() => handleImageDelete()}
                        >
                            삭제
                        </button>
                    </div>
                    <div>
                        <label>이름</label>
                        <br />
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
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
                        <label>상시</label>
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
                        <label>임시</label>
                    </div>
                    {formData.storeType === '상시' && (
                        <div>
                            <label>사업자 등록번호</label>
                            <input
                                type="text"
                                name="corporateRegistrationNumber"
                                value={
                                    formData.corporateRegistrationNumber || ''
                                }
                                readOnly
                            />
                        </div>
                    )}
                    {formData.storeType === '임시' && (
                        <div>
                            <label>개업일</label>
                            <br />
                            <input
                                type="date"
                                name="openDate"
                                value={formData.openDate || ''}
                                readOnly
                            />
                            <br />
                            <label>폐업일</label>
                            <br />
                            <input
                                type="date"
                                name="closeDate"
                                value={formData.closeDate || ''}
                                readOnly
                            />
                        </div>
                    )}
                    <div>
                        <label>가게 설명</label>
                        <br />
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleInputChange}
                            rows="5"
                            cols="100"
                        />
                    </div>
                    <div>
                        <label>가게 주소</label>
                        <br />
                        <input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>공지</label>
                        <br />
                        <textarea
                            name="notice"
                            value={formData.notice || ''}
                            onChange={handleInputChange}
                            rows="5"
                            cols="100"
                        />
                    </div>
                    <div>
                        <label>개점시간</label>
                        <br />
                        <input
                            type="time"
                            name="openTime"
                            value={formData.openTime || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>폐점시간</label>
                        <br />
                        <input
                            type="time"
                            name="closeTime"
                            value={formData.closeTime || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>휴무일</label>
                        <br />
                        <ToggleButtonGroup
                            value={formData.holidays || []}
                            onChange={handleHolidaysChange}
                            aria-label="day"
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
                    </div>
                    <button type="submit">제출</button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default StoreModifyModal
