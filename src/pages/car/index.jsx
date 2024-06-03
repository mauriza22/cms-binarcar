/** @format */

import { Button, Col, Row } from 'reactstrap';
import Car from '../../assets/img/inova.car.png';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import ic_delete from '../../assets/img/logo.delete.png';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const convertMoney = (number = 0) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

const ListCar = (props) => {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [sendId, setSendId] = useState(null);

  const fetchApi = (page) => {
    axios
      .get('https://api-car-rental.binaracademy.org/admin/v2/car', {
        params: {
          page,
          pageSize,
        },
        headers: {
          access_token: localStorage?.getItem('TOKEN'),
        },
      })
      .then((result) => {
        setData(result?.data?.cars);
        setTotalPages(result?.data?.pageCount);
      });
  };

  useEffect(() => {
    fetchApi(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <nav
        className="pb-4"
        style={{ '--bs-breadcrumb-divider': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='currentColor'/%3E%3C/svg%3E\")" }}
        aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item first-list">{props.title}</li>
          <li className="breadcrumb-item" aria-current="page">
            List Car
          </li>
        </ol>
      </nav>
      <div className="d-flex justify-content-between mb-4">
        <h4>{props.title}</h4>
        <Button
          onClick={() => navigate('/car/form')}
          type="button"
          className="d-flex align-items-center gap-2 rounded-0"
          style={{
            background: '#0D28A6',
          }}>
          <i className="fa fa-plus" />
          Add New Car
        </Button>
      </div>
      <div className="btn-group gap-3 rounded-0 pt-2" role="group" aria-label="Basic checkbox toggle button group">
        <input type="checkbox" className="btn-check rounded-0" id="btncheck1" autoComplete="off" />
        <label className="btn btn-outline-primary rounded-0">All</label>

        <input type="checkbox" className="btn-check" id="btncheck2" autoComplete="off" />
        <label className="btn btn-outline-primary">2 - 4 People</label>

        <input type="checkbox" className="btn-check" id="btncheck3" autoComplete="off" />
        <label className="btn btn-outline-primary">4 - 6 People</label>

        <input type="checkbox" className="btn-check rounded-0" id="btncheck3" autoComplete="off" />
        <label className="btn btn-outline-primary rounded-0">6 - 8 People</label>
      </div>
      <div>
        <Row className="gap-y-2">
          {data?.map((item, index) => (
            <Col lg={4} key={index} className="gy-4">
              <div
                className="bg-white p-4 border-1 rounded-3 shadow-sm"
                style={{
                  background: 'white',
                  width: '100%',
                }}>
                <img src={item.image ?? Car} alt="picimages" style={{ width: '100%', height: 210 }} />
                <div className="d-flex flex-column gap-2">
                  <h4 className="pt-3" style={{ fontSize: '14px', fontWeight: 'normal' }}>
                    {item.name ?? 'Unindetify car'}
                  </h4>
                  <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{convertMoney(item?.price)} / Hari</h4>
                  <span className="d-flex align-items-center gap-1" style={{ fontSize: '14px', fontWeight: 'normal' }}>
                    <i className="fa fa-users" />
                    6-8
                  </span>
                  <span className="d-flex align-items-center gap-1" style={{ fontSize: '14px', fontWeight: 'normal' }}>
                    <i className="fa fa-calendar-day" />
                    Updated at {format(new Date(item?.updatedAt), 'eee, dd MMM yyyy HH:mm ')}
                  </span>
                </div>
                <div className="d-flex gap-4 w-100 pt-3">
                  <Button
                    onClick={() => {
                      setOpen(!open);
                      setSendId(item?.id);
                    }}
                    className="w-100 d-flex gap-2 align-items-center justify-content-center rounded-0"
                    size="md"
                    color="danger"
                    outline>
                    <i className="fa fa-trash" />
                    Delete
                  </Button>
                  <Button type="button" onClick={() => navigate(`/car/${item.id}/edit`)} className="w-100 d-flex gap-2 align-items-center justify-content-center rounded-0" size="md" color="success">
                    <i className="fa fa-edit" />
                    Edit
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <Pagination className="justify-content-center" aria-label="Page navigation" style={{ justifyContent: 'center' }}>
        <PaginationItem disabled={currentPage <= 1}>
          <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem active={i + 1 === currentPage} key={i}>
            <PaginationLink onClick={() => handlePageChange(i + 1)}>{i + 1}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem disabled={currentPage >= totalPages}>
          <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
        </PaginationItem>
      </Pagination>
      <ModalDelete
        open={open}
        setOpen={setOpen}
        id={sendId}
        refetch={() => {
          fetchApi(currentPage);
        }}
      />
    </div>
  );
};

const ModalDelete = ({ open, setOpen, id, refetch }) => {
  const navigate = useNavigate();
  const removeApi = () => {
    axios
      .delete(`https://api-car-rental.binaracademy.org/admin/car/${id}`, {
        headers: {
          access_token: localStorage?.getItem('TOKEN'),
        },
      })
      .then(() => {
        navigate('/car');
        setOpen(false);
        document.body.style.overflow = '';
        refetch();
      });
  };
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
  }, [open]);
  if (!open) return <div />;
  return (
    <div
      className="position-fixed w-100"
      style={{
        background: '#0000004a',
        height: '100vh',
        left: 0,
        top: '0',
      }}>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="h-50 w-25 bg-white d-flex flex-column gap-2 text-center justify-content-center align-items-center">
          <img src={ic_delete} alt="remove-pict" />
          <h4 style={{ fontSize: 16 }}>Menghapus Data Mobil</h4>
          <p style={{ font: 14 }}>Setelah dihapus, data mobil tidak dapat dikembalikan. Yakin ingin menghapus?</p>
          <div className="d-flex px-5 gap-3 w-100">
            <Button onClick={removeApi} size="sm" className="w-100" style={{ color: 'white', background: '#0D28A6' }} type="button">
              ya
            </Button>
            <Button
              onClick={() => {
                setOpen(!open);
                document.body.style.overflow = '';
              }}
              size="sm"
              className="w-100"
              style={{ color: '#0D28A6', background: 'white', border: '1px solid #0D28A6' }}
              type="button">
              Tidak
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCar;
