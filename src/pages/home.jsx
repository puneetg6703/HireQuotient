import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Table,
  FormGroup,
  Label,
  Input,
  Button,
  Badge,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faPenToSquare,faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import '../styles/home.css'
import { Link } from 'react-router-dom';
import {ColorRing} from 'react-loader-spinner';
import _ from 'lodash';
import Pagination from '@mui/material/Pagination';

const Home = () => {
  const [dataLoading, setDataLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setpage] = useState(1);
  const [selectedall, setselectedall] = useState(false);
  const [searchTerm, setsearchTerm] = useState('');
  const [FilteredUsers,setFilteredUsers]=useState([]);
  const [edit,setedit]=useState(false);
  useEffect(() => {
    setselectedall(false);
    fetchData();
    
    // eslint-disable-next-line
  }, []);
  useEffect(()=>{
    const filtered = data.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setpage(1);
  },[searchTerm,data])
  const deleteselecteditems=(e)=>{
    e.preventDefault();
    setData((prevdata)=>{
      return prevdata.filter((item)=>item.checked==undefined||item.checked==false)
    })
    setselectedall(false);
  }
  const handleallselect=(e)=>{
    e.preventDefault();
    setselectedall(!selectedall);
    setData((prevdata)=>{
      return  prevdata.map((item,index)=>{
        if(index>=(page-1)*10&&index<page*10){
          return {...item,checked:!selectedall}
        }
        else return item;
      })
    });
  }
  const handledelete=(e,id)=>{
    e.preventDefault();
    setData((prevdata)=>{
      return prevdata.filter((item)=>item.id!=id)
    });
  }

  const fetchData = async (page=1) => {
    try {
      setDataLoading(true);
      const response = await fetch(
        `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
      );
      const data=await response.json();
      console.log(data);
      setData(data);
      setDataLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  const checkIsExpired = (given_date) => {
    return new Date() > new Date(given_date);
  };
  const handlechangepage=(e)=>{
    console.log(e.target.textContent);
    setpage(e.target.textContent);
  }
  const handleitemcheck=(e,id)=>{
    e.preventDefault();
    setData((prevdata)=>prevdata.map((item)=>{
      return item.id==id?{...item,checked:true}:item;
    }));
  }
  const handleedit=(id)=>{
    const updatedUsers = data.map((user) =>
    user.id === id ? { ...user, isEditing: true } : user
  );
  setData(updatedUsers);
  }
  const handleconfirm = (id) => {
    const updatedUsers = data.map((user) =>
      user.id === id ? { ...user, isEditing: false } : user
    );
    setData(updatedUsers);
  };
  const handleEditUser = (id, field, value) => {
    const updateddata = data.map((user) =>
      user.id === id ? { ...user, [field]: value } : user
    );
    setData(updateddata);
  };

  function TableHeader() {
    function CommonHeader() {
      return (
        <>
          <th><Input
          addon
          aria-label="Checkbox for following text input"
          type="checkbox"
          onChange={handleallselect}
          checked={selectedall}
        /></th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </>
      );
    }
        return (
          <>
            <CommonHeader />
          </>
        );
  }
  
  function TableRow({item }) {
    function CommonColumn({item }) {
      return (
        <>
          <th>
          <Input
          addon
          aria-label="Checkbox for following text input"
          type="checkbox"
          onChange={(e)=>handleitemcheck(e,item.id)}
          checked={item.checked!=undefined?item.checked:false}
        />
          </th>
          <td> {item.isEditing ? (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          handleEditUser(item.id, "name", e.target.value)
                        }
                      />
                    ) : (
                      item.name
                    )}</td>
          <td>{item.isEditing ? (
                      <input
                        type="text"
                        value={item.email}
                        onChange={(e) =>
                          handleEditUser(item.id, "email", e.target.value)
                        }
                      />
                    ) : (
                      item.email
                    )}</td>
          <td>{item.isEditing ? (
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) =>
                          handleEditUser(item.id, "role", e.target.value)
                        }
                      />
                    ) : (
                      item.role
                    )}</td>
          <td style={{display:"flex",gridGap:"0.5rem"}}>{item.isEditing?<button onClick={()=>handleconfirm(item.id)}><FontAwesomeIcon icon={faSquareCheck} /></button>:<button onClick={()=>handleedit(item.id)}><FontAwesomeIcon icon={faPenToSquare} /></button>}<button onClick={(e)=>handledelete(e,item.id)}><FontAwesomeIcon icon={faTrash} color='red'/></button></td>
        </>
      );
    }
        return (
          <>
            <CommonColumn item={item} />
          </>
        )
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <>
                    <Row className="mt-2">
                      <Col>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            fetchData(
                              1,
                              null,
                              searchTerm
                            );
                          }}
                        >
                          <FormGroup className="d-flex justify-content-end">
                            <Col md="12">
                              <Row style={{width:"92%",display:"flex",justifyContent:"space-between"}}>
                                <Col md="4" style={{width:"35%"}}>
                                  <Input
                                    className="form-control"
                                    type="text"
                                    onChange={(e) => {
                                      setsearchTerm(e.target.value.trim());
                                    }}
                                    placeholder="Enter Values..."
                                  />
                                </Col>
                                <Col md="4">
                                    <button  onClick={deleteselecteditems}><FontAwesomeIcon icon={faTrash} color='red'/></button>
                                </Col>
                              </Row>
                            </Col>
                          </FormGroup>
                        </form>
                      </Col>
                    </Row>
                    {dataLoading ? (
                      <div className="text-center">
                        <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="blocks-loading"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                        />
                      </div>
                    ) : (
                      <div className="table-rep-plugin">
                        <div
                          className="table-responsive mb-0"
                          data-pattern="priority-columns"
                        >
                          <table
                            id="tech-companies-1"
                          >
                            <thead>
                              <tr>
                                <TableHeader />
                              </tr>
                            </thead>
                            <tbody>
                              {FilteredUsers?.map((item, index) => (
                                (index>=(page-1)*10&&index<(page)*10&&<tr key={index}>
                                  <TableRow
                                    item={item}
                                  />
                                </tr>
                              )))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    <Row className="mt-2" style={{display:"flex",justifyContent:"space-between",width:"85%",margin:"auto"}}>
                      <Col md="5">
                        <p>
                          <strong>
                            {' '}
                            Showing{' '}
                            {(page - 1) *
                              10 +
                              1}{' '}
                            to{' '}
                            {Math.min(
                              page * 10,
                              FilteredUsers.length
                            )}{' '}
                            of {FilteredUsers.length} entries
                          </strong>
                        </p>
                      </Col>
                      {!dataLoading && data.length > 0 && (
                        <Col md="7" style={{marginTop:"10px"}}>
                          <Pagination count={Math.ceil(FilteredUsers.length/10)} onChange={handlechangepage}/>
                        </Col>
                      )}
                    </Row>
                  </>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Home;
