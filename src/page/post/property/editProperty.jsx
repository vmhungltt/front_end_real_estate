import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { update } from "./propertyReducer";
import { useDispatch, useSelector } from "react-redux";
import AddressService from "../../../service/address.service";
import UtilityService from "../../../service/utility.service";
import CategoryService from "../../../service/category.service";
import TypeService from "../../../service/type.service";
import { CKEditor } from "ckeditor4-react";
import {getLoad } from "./selectProperty";
function EditProperty({setTab, dataEdit, setPop}){

  const isLoad = useSelector(getLoad);
    const [dataDeleteFiles, setDataDeleteFiles] = useState([]);
    const [imagesDelete, setImageDelete] = useState([]);
    
    
   const [listValue, setListValue] = useState([])
    
    const dispatch = useDispatch();
    const [file, setFile] = useState(false);
    const [files, setMultipleFile] = useState(false);
    const [fileName, setNameFile] = useState({ 
      file: "Hoặc thả vào đây",
      files: "Hoặc thả vào đây",
    });
    const [success, setSuccess] = useState(false);
    const [listChecked, setListChecked] = useState([]);
   
    const [listUtility, setListUtility] = useState([]);
    const [listDistrict, setListDistrict] = useState(false);
    const [listCity, setListCity] = useState([]);
    const [listType, setListType] = useState([]);
    const [listWard, setListWard] = useState(false);
    const [listCategory, setListCategory] = useState([]);
    const [codeCity, setCodeCity] = useState(false);
    const [codeDistrict, setCodeDistrict] = useState(false);
    const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(dataEdit.content);
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [active, setActive] = useState("");
  const [utility, setUtility] = useState([]);
  const [category, setCategory] = useState("");
  const [type, setType] = useState([]);


  useEffect(()=> {
  setPrice(dataEdit.price);
  setTitle(dataEdit.title);
  setContent(dataEdit.content);
  setAddress(dataEdit.address);
  setArea(dataEdit.area);
  setActive(dataEdit.active);
 setCategory(dataEdit.category_id._id); 
    setImageDelete(dataEdit.library);
    setListValue(() => {
      if(dataEdit.information_id.length === 0){
          return [];
      }else {
          let arrayPush = [];
          dataEdit.information_id.map((item) => {
              arrayPush.push(item.value_id._id);
          })
          return (arrayPush);
      }
  });
  setListChecked(() => {
    if(dataEdit.information_id.length === 0) {
       return ([]);
    }else {
       let pushArray = [];
       dataEdit.information_id.map((item) => {
           pushArray.push(item.type_id._id);
       })
       return (pushArray);
    }
});
setUtility(() => {
  if(dataEdit.utility.length === 0){
     return ([]);
  }else {
     let dataPush = [];
     dataEdit.utility.map((item) => {
         dataPush.push(item._id);
     })
     return (dataPush);
  }
});
setType(() => {
  if(dataEdit.information_id.length === 0){
      return [];
  }else {
      let arrayPush = [];
      dataEdit.information_id.map((item) => {
          arrayPush.push({type_id : item.type_id._id, value_id : item.value_id._id});
      })
      return (arrayPush);
  }
});
  }, [dataEdit]);




  const [error, setError] = useState({
    file: false,
    files: false,
    price: false,
    title: false,
    content: false,
    address: false,
    area: false,
    category: false,
  });
  const handleDeleteImages = (payload, action) => {
    if(action === 'edit'){
        setDataDeleteFiles((prev) => {
            return [...prev, payload];
        })
         setImageDelete(() => {
             const dataDeleted = imagesDelete.filter((item) => item.thumb !== payload);
             return(dataDeleted);
         })
       
    }else if(action === 'current'){
        setMultipleFile(() => {
             const dataDeleted = files.filter((item) => item.thumb !== payload);
             return(dataDeleted);
        })
    }
    
     
  }
  useEffect(() => {
    const getListType = async () => {
      const dataType = await TypeService.index();
      setListType(dataType);
    };
    const getListCategory = async () => {
      const dataCategory = await CategoryService.getAll();
      setListCategory(dataCategory);
    };
    const getUtility = async () => {
      const dataUtility = await UtilityService.getALl();
      setListUtility(dataUtility);
    };
    const getCity = async () => {
      const dataCity = await AddressService.getCity();
      setListCity(dataCity);
    };
    getListType();
    getListCategory();
    getUtility();
    getCity();
  }, []);

  useEffect(() => {
    const getDistrict = async (code) => {
      const dataDistrict = await AddressService.getDistrict(code);
      setListDistrict(dataDistrict);
    };
    if (codeCity) getDistrict(codeCity);
  }, [codeCity]);

  useEffect(() => {
    const getWard = async (code) => {
      const dataWard = await AddressService.getWard(code);
      setListWard(dataWard);
    };
    if (codeDistrict) getWard(codeDistrict);
  }, [codeDistrict]);

  const handleSetUtility = (value) => {
    setUtility((prev) => {
        const isChecked = utility.includes(value);
        if (isChecked === true) {
          return utility.filter((item) => item !== value);
        } else {
          return [...prev, value];
        }
      });
  }
  const handleSetType = (value) => {
    setType((prev) => {
        if (type.filter((e) => e.type_id === value.type_id).length > 0) {
          const update = type.map((item) => {
            if (item.type_id === value.type_id) {
              item.value_id = value.value_id;
            }
            return item;
          });
          setListValue(() => {
            if(update.length === 0) {
                return ([]);
             }else {
                let pushArray = [];
                update.map((item) => {
                    pushArray.push(item.value_id);
                })
                return (pushArray);
             }
          })
          return update;
        } else {
            setListValue((prev) => {
                return [...prev, value.value_id];
            });
          return [...prev, value];
        }
      });

    
  }
  const handleFile = (file) => {
    file.map((file) =>
    Object.assign(file, {
        preview : URL.createObjectURL(file),
    })
  );
  setFile(file[0]);
  setNameFile({ ...fileName, file: file[0].name });
  }
  const handleMultipleFile = (files) => {
    var name = "";
    files.map((file) => {
      Object.assign(file, {
        thumb: URL.createObjectURL(file),
      });
      name = name + " " + file.name;
    });
    setNameFile({ ...fileName, files: name });
    setMultipleFile(files);
  }
  const validateForm = () => {
    var checkValidate = false;
    setError({
      price: false,
      title: false,
      content: false,
      address: false,
      area: false,
      category: false,
    });
    if (content === "") {
      setError((prev) => {
        return { ...prev, content: "* Nội dụng không được để trống" };
      });
      checkValidate = true;
    }
    if (address === "") {
      setError((prev) => {
        return { ...prev, address: "* Địa chỉ không được để trống" };
      });
      checkValidate = true;
    }
    if (price === "") {
      setError((prev) => {
        return { ...prev, price: "* Giá không được để trống" };
      });
      checkValidate = true;
    }
    if (area === "") {
      setError((prev) => {
        return { ...prev, area: "* Khu vực không được để trống" };
      });
      checkValidate = true;
    }
    if (category === "") {
      setError((prev) => {
        return { ...prev, category: "* Danh mục không được để trống" };
      });
      checkValidate = true;
    }
    if (title === "") {
      setError((prev) => {
        return { ...prev, title: "* Tiêu đề không được để trống" };
      });
      checkValidate = true;
    }
    
    if(checkValidate === true){
      return (true);
    }else {
      return (false);
    }
  }
  const handleSubmit = () => {
    if(validateForm() === false){
       const payLoad = {file : file, files : files, data : {dataDeleteFiles : dataDeleteFiles, slug : dataEdit.slug, price : price,title : title, content : content, address : address, area : area, active : active, category : category, utility : utility, type : type}};
       dispatch(update(payLoad));
      setSuccess('Cập nhật thành công');
     }
  }
  const handleUtility = (data) => {
    setType((prev) => {
        if (type.filter((e) => e.type_id === data).length > 0) {
          const dataDeleted = type.filter((item) => item.type_id !== data);
          return dataDeleted;
        } else {
          return prev;
        }
      });
      setListChecked((prev) => {
        const isChecked = listChecked.includes(data);
        if (isChecked === true) {
          return listChecked.filter((item) => item !== data);
        } else {
          return [...prev, data];
        }
      });
  }
  // console.log('hook ',imagesDelete)
  // console.log('dataEdit',dataEdit.library)
    return (<div className="container custom_top">
        <div className=" card card-warning">
          <div className="card-header">
            <h3 className="card-title custom_title_left">Sửa bài viết "{dataEdit.title}"</h3>
            <div className="card-tools custom-close">
         
            <button  onClick={() => setTab(false)} type="button" className="btn btn-tool " data-card-widget="remove">
         <i className="fa fa-close"></i>
         </button>
       </div>
          </div>
          <div style={{"clear" : "both"}}></div>
          <form>
            <div className="card-body">
            {success && <div className="alert alert-success">
                <strong>Thành công!</strong>  {success}.
              </div>}
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Tiêu đề </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Nhập tiêu đề"
                />
              </div>
              {error.title && <div className="alert alert-danger">
                <strong>Lỗi!</strong> {error.title}.
              </div>}
              
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Giá</label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Nhập giá"
                />
              </div>
              {error.price &&  <div className="alert alert-danger">
                <strong>Lỗi!</strong> {error.price}.
              </div> }
             
              <div className="form-group">
                <label>Danh mục</label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-control"
                >
                  <option value="">--- Lựa chọn ---</option>
                  {listCategory.map((item, key) => (
                    <option value={item._id} key={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
               {error.category && <div className="alert alert-danger">
    <strong>Lỗi!</strong> {error.category}.
  </div>}
              <div className="form-group">
                <label>Tỉnh</label>

                <select
                  onChange={(e) => {
                    setAddress("");
                    setListWard(false);
                    setCodeCity(() => {
                      if (e.target.value !== "0") {
                        return e.target.value;
                      } else {
                        setListDistrict(false);
                      }
                    });
                  }}
                  className="form-control"
                >
                  <option value="0">--- Lựa chọn ---</option>
                  {listCity.map((item, key) => (
                    <option value={item.code} key={key}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              {listDistrict && (
                <div className="form-group">
                  <label>Quận, Huyện</label>
                  <select
                    onChange={(e) => {
                      setAddress("");
                      setListWard(false);
                      setCodeDistrict(() => {
                        if (e.target.value !== "0") {
                          return e.target.value;
                        } else {
                          setListWard(false);
                        }
                      });
                    }}
                    value={codeDistrict}
                    className="form-control"
                  >
                    <option value="0">--- Lựa chọn ---</option>
                    {listDistrict.map((item, key) => (
                      <option value={item.code} key={key}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {listWard && (
                <div className="form-group">
                  <label>Xã, Phường, Thị trấn</label>
                  <select
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    className="form-control"
                  >
                    <option value="">--- Lựa chọn ---</option>
                    {listWard.map((item, key) => (
                      <option value={item.path_with_type} key={key}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
               {error.address &&  <div className="alert alert-danger">
    <strong>Lỗi!</strong> {error.address}.
  </div>}
              <div className="form-group">
                <label>Diện tích</label>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Nhập diện tích m²"
                />
             
              </div>
             {error.area &&  <div className="alert alert-danger">
    <strong>Lỗi!</strong> {error.area}.
  </div>}
              {listType && (
                <div className="form-group">
                  <label>
                    Tiện ích mở rộng (* Nếu có ! điền giá trị tương ứng)
                  </label>
                  {listType.map((item, key) => (
                    <div key={key} className="form-check">
                      <input
                        checked={listChecked.includes(item._id)}
                        onChange={() => handleUtility(item._id)}
                        className="form-check-input"
                        type="checkbox"
                      />
                      <label className="form-check-label custom-label">{item.name}</label>
                    </div>
                  ))}
                </div>
              )}
              {listChecked.length > 0 ? (
                <div className="float-button">
                  {listType.map((item, key) => {
                    if (listChecked.includes(item._id)) {
                      return (
                        <div key={key} className="dropdown dropend">
                          <button
                            type="button"
                            className="custom-btn btn btn-warning dropdown-toggle"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            {item.name}
                          </button>
                          <div className="dropdown-menu">
                            <div className="form-group">
                              <center>
                                <label>
                                  Lựa chọn giá trị phù hợp cho {item.name}
                                </label>
                              </center>
                              <select
                                onChange={(e) => {
                                    handleSetType({
                                        type_id: item._id,
                                        value_id: e.target.value,
                                      });
                                    
                                }
                                  
                                }
                                multiple={true}
                                className="custom-select"
                                value={listValue}
                              >
                                {item.multiple_value.map((item1, key) => (
                                  <option 
                               
                                  key={key} value={item1._id}>
                                    {item1.value}{" "}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                ""
              )}
              <div style={{ clear: "both" }}></div> <br />
              {listUtility && (
                <div className="form-group">
                  <label>Tiện ích chính (* Nếu có)</label>
                  {listUtility.map((item, key) => (
                    <div key={key} className="form-check">
                      <input
                        onChange={() => handleSetUtility(item._id)}
                        className="form-check-input"
                        type="checkbox"
                        checked={utility.includes(item._id)}
                      />
                      <label className="form-check-label custom-label">{item.name}</label>
                    </div>
                  ))}
                </div>
              )}
              <Dropzone onDrop={(acceptedFiles) => handleFile(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <div className="form-group">
                    <label>Thay đổi ảnh đại diện</label>
                    <div {...getRootProps()} className="input-group">
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          {...getInputProps()}
                        />
                        <label className="custom-file-label">
                          {fileName.file}
                        </label>
                      </div>
                      <div className="input-group-append">
                        <span className="input-group-text">Chọn từ tệp</span>
                      </div>
                    </div>
                 
                      <div className="col-12">
                        <div className="card card-primary">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-2">
                                <img
                                  src={file.preview ? file.preview : dataEdit.thumb}
                                  className="img-fluid mb-2 image_status_custom"
                                  alt="white sample"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                   
                  </div>
                )}
              </Dropzone>
              {error.file && <div className="alert alert-danger">
    <strong>Lỗi!</strong> {error.file}.
  </div>}
              <Dropzone
                onDrop={(acceptedFiles) => handleMultipleFile(acceptedFiles)}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="form-group">
                    <label>Chọn nhiều ảnh tham khảo</label>
                    <div {...getRootProps()} className="input-group">
                      <div className="custom-file">
                        <input
                          type="file"
                          ref="file"
                          multiple="multiple"
                          className="custom-file-input"
                          {...getInputProps()}
                        />
                        <label className="custom-file-label">
                          {fileName.files}
                        </label>
                      </div>
                      <div className="input-group-append">
                        <span className="input-group-text">Chọn từ tệp</span>
                      </div>
                    </div>
                   
                       <div className="col-12">
                        <div className="card card-primary">
                          <div className="card-body">
                            <div className="row">
                              
                               {imagesDelete.map((item, key) => (
                                <div key={key} className="col-sm-2 custom_image_margin">
                                  <img
                                    onClick={() => handleDeleteImages(item.thumb, 'edit')}
                                    src={item.thumb}
                                    className="img-fluid mb-2 image_status_custom"
                                    alt="white sample"
                                  />
                                </div>
                              ))}

                          {files && 
                           <div className="card-body">
                           <div className="row">
                           {files.map((item, key) => (
                                <div key={key} className="col-sm-2 custom_image_margin">
                                  <img
                                  onClick={() => handleDeleteImages(item.thumb, 'current')}
                                    src={item.thumb}
                                    className="img-fluid mb-2 image_status_custom"
                                    alt="white sample"
                                  />
                                </div>
                              ))}
                              </div>
                            </div> }
                              

                            </div>
                          </div>
                        </div>
                      </div> 
                 
                  </div>
                )}
              </Dropzone>
              {error.files && <div className="alert alert-danger">
    <strong>Lỗi!</strong> {error.files}.
  </div>}
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Nội dung</label>
                <CKEditor
                  onChange={(evt) => setContent(evt.editor.getData())}
                  initData={dataEdit.content}
                />
              </div>
              {error.content && <div className="alert alert-danger">
    <strong>Lỗi!</strong> {error.content}.
  </div>} 
              <div className="form-group">
                <label>Trạng thái bài đăng</label>
                <div className="form-check">
                  <input
                    onChange={() => setActive(1)}
                    checked={1 === active}
                    className="form-check-input"
                    type="radio"
                    name="radio1"
                  />
                  <label className="custom-label form-check-label">Đăng bán</label>
                </div>
                <div className="form-check">
                  <input
                    onChange={() => setActive(2)}
                    checked={2 === active}
                    className="form-check-input"
                    type="radio"
                    name="radio1"
                  />
                  <label className="custom-label form-check-label">Phác thảo</label>
                </div>
                {!isLoad && success ? <div className="alert alert-success">
                <strong>Thành công!</strong>  {success}.
              </div> : ''}
              </div>
            </div>

            <div className="card-footer">
              <button
                onClick={handleSubmit}
                type="button"
                className="btn btn-primary"
              >
                Lưu lại
              </button>
            </div>
          </form>
        </div>
        { isLoad &&  <div className="overlay-wrapper">
            <div className="overlay">
                <div className="text-bold pt-2">Đang cập nhật <i className="fa fa-spinner fa-spin" ></i>
                </div>
             </div>
        </div>}
      </div>)
}
export default EditProperty;