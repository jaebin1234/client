import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useCallback, useState, useRef } from 'react';

import { getAllRoomRes, getAllRoomResPage, delRoomRes } from 'components/ApiModules/ApiHandler';

import LinearProgress from '@mui/material/LinearProgress';
import { Avatar, Button } from 'antd';
import RoomFilter from './RoomFilter';
import Pagination from './Pagination';
import EmpCustomization from 'layout/Customization/EmpCustomization';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BasicExampleDataGrid() {
    const [roomResData, setRoomResData] = useState([]);
    const [totalPage, setTotalPage] = useState('');

    const dataColumns = [
        { field: 'roomNo', headerName: '회의실 번호', hide: false, sortable: true },
        { field: 'title', headerName: '회의 제목', width: 200, hide: false, sortable: true },
        { field: 'content', headerName: '회의실 설명', width: 200, hide: false, sortable: true },
        { field: 'categoryName', headerName: '회의실 이름', hide: false, sortable: true },
        { field: 'capacity', headerName: '정원', hide: false, sortable: true },
        { field: 'modifiedAt', headerName: '최종수정일', width: 200, hide: false, sortable: true },
        { field: 'createdAt', headerName: '예약일', width: 200, hide: false, sortable: true },
        { field: 'startedAt', headerName: '시작시간', width: 200, hide: false, sortable: true },
        { field: 'endedAt', headerName: '종료시간', width: 200, hide: false, sortable: true },
        { field: 'name', headerName: '예약자', width: 200, hide: false, sortable: true },
        {
            field: 'id',
            headerName: '예약 번호',
            renderCell: (params) => <DeleteIcon onClick={() => del(`${params.value}`)} />,
            hide: false,
            sortable: false
        }
    ];
    const del = async (resId) => {
        let result = confirm('삭제하시겠습니까?');
        if (result) {
            let del = await delRoomRes(resId);
            console.log(del);
            return alert('삭제가 완료 됐습니다.');
        }
        //delete 함수
    };

    const res = useCallback(async (page, deptFilter, teamFilter, positionFilter, name, empNo, startedAt, endedAt) => {
        setRoomResData([]);

        let roomRes = await getAllRoomResPage(page, deptFilter, teamFilter, positionFilter, name, empNo, startedAt, endedAt); //nowPage
        console.log(startedAt);
        console.log('예약현황 : ', roomRes);
        if (roomRes.length != 0) {
            console.log(Math.floor(roomRes[0].total / 10 + 1));
            setTotalPage(Math.floor(roomRes[0].total / 10 + 1));

            let test = roomRes.map((data) => {
                return {
                    id: data.reservationResDTO.id,
                    roomNo: data.reservationResDTO.room.roomNo,
                    title: data.reservationResDTO.title,
                    content: data.reservationResDTO.reason,
                    categoryName: data.reservationResDTO.room.categoryName,
                    capacity: data.reservationResDTO.room.capacity,
                    modifiedAt: data.reservationResDTO.modifiedAt,
                    createdAt: data.reservationResDTO.createdAt,
                    startedAt: data.reservationResDTO.startedAt,
                    endedAt: data.reservationResDTO.endedAt,
                    name: data.reservationResDTO.emp.name
                };
            });
            setRoomResData([...test]);
            console.log(test);
        } else {
            setTotalPage(0);
        }
    });

    useEffect(() => {
        res(1, null, null, null, null, null, null, null);
    }, []);
    //10개씩 보여줄 심산

    return (
        <div style={{ height: '70vh', width: '100%' }}>
            <RoomFilter totalPage={totalPage} res={res} />
            <DataGrid columns={dataColumns} rows={roomResData} components={{ Toolbar: GridToolbar }} />
        </div>
    );
}
