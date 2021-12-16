import { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { getProfile, updateProfile } from "../data/profile.repository";
import MessageContext from "../contexts/MessageContext";
import { getUser } from "../data/user.repository";
//set profile info
export default function EditProfile() {
  const [profile, setProfile] = useState(null);
  const [fields, setFields] = useState(null);
  const [errors, setErrors] = useState({ });
  const { setMessage } = useContext(MessageContext);
  const history = useHistory();
  const username = getUser().username;

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = "#f5f6fa";

    return () => {
      document.getElementById("root").style.backgroundColor = null;
    };
  }, []);

  useEffect(() => {
    async function loadProfile() {
      const currentProfile = await getProfile(username);
      setProfile(currentProfile);
      setFieldsNullToEmpty(currentProfile);
    }
    loadProfile();
  }, [username]);

  const setFieldsNullToEmpty = (currentFields) => {
    currentFields = { ...currentFields };

    for(const [key, value] of Object.entries(currentFields)) {
      currentFields[key] = value !== null ? value : "";
    }

    setFields(currentFields);
  };

  const handleInputChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { trimmedFields, isValid } = handleValidation();
    if(!isValid)
      return;

    const profile = await updateProfile(trimmedFields);

    setMessage(<><strong>{profile.first_name} {profile.last_name}</strong> profile has been updated successfully.</>);

    setTimeout(()=>{
      history.push("/profile");
    },1000)
    
  };

  const handleValidation = () => {
    const trimmedFields = trimFieldsEmptyToNull();
    const currentErrors = { };

    let key = "first_name";
    let field = trimmedFields[key];
    if(field === null || field === undefined)
      currentErrors[key] = "First name is required.";
    else if(field.length > 40)
      currentErrors[key] = "First name length cannot be greater than 40.";

    key = "last_name";
    field = trimmedFields[key];
    if(field === null || field === undefined)
      currentErrors[key] = "Last name is required.";
    else if(field.length > 40)
      currentErrors[key] = "Last name length cannot be greater than 40.";

    key = "mobile";
    field = trimmedFields[key];
    if(field !== null && field !== undefined &&field.match(/^04\d{2} \d{3} \d{3}$/) === null)
      currentErrors[key] = "Mobile format must be: 04xx xxx xxx";

    key = "street";
    field = trimmedFields[key];
    if(field !== null && field !== undefined && field.length > 100)
      currentErrors[key] = "Street length cannot be greater than 100.";

    key = "city";
    field = trimmedFields[key];
    if(field !== null && field !== undefined && field.length > 100)
      currentErrors[key] = "Street length cannot be greater than 100.";

    key = "postcode";
    field = trimmedFields[key];
    if(field !== null && field !== undefined && field !== undefined && field.match(/^\d{4}$/) === null)
      currentErrors[key] = "Postcode must be 4 digits.";

    key = "email";
    field = trimmedFields[key];
    if(field !== null && field !== undefined && field !== undefined && field.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/) === null)
      currentErrors[key] = "Email must be valid.";

    setErrors(currentErrors);

    return { trimmedFields, isValid: Object.keys(currentErrors).length === 0 };
  };

  // Note: Empty fields are converted to null.
  const trimFieldsEmptyToNull = () => {
    const trimmedFields = { };

    for(const [key, value] of Object.entries(fields)) {
      let field = value;

      // If value is not null trim the field.
      if(field !== null) {
        field = field.trim();

        // If the trimmed field is empty make it null.
        if(field.length === 0)
          field = null;
      }

      trimmedFields[key] = field;
    }

    setFieldsNullToEmpty(trimmedFields);

    return trimmedFields;
  };

  if(profile === null || fields === null)
    return null;

  return (
    <div style={{ backgroundColor: "#f5f6fa" }}>
      <div>
        <div className="row">
          <div className="col-12 col-md-3 bg-white">
            <div className="text-center mt-2">
              <div>
                <i className="bi bi-person-circle" style={{ fontSize: 75 }}></i>
              </div>
              <h5>{profile.first_name} {profile.last_name}</h5>
              <h6 className="text-muted">{profile.email}</h6>
            </div>
          </div>
          <div className="col-12 col-md-9">
            <div className="ml-md-4">
              <form onSubmit={handleSubmit}>
                <div className="row bg-white">
                  <div className="col-12">
                    <h6 className="my-2 text-primary">Personal Details</h6>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="first_name" className="control-label">First Name</label>
                      <input name="first_name" id="first_name" className="form-control"
                        value={fields.first_name} onChange={handleInputChange} />
                      {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="last_name" className="control-label">Last Name</label>
                      <input name="last_name" id="last_name" className="form-control"
                        value={fields.last_name} onChange={handleInputChange} />
                      {errors.last_name && <div className="text-danger">{errors.last_name}</div>}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="email" className="control-label">Email</label>
                      {errors.email && <div className="text-danger">{errors.email}</div>}
                      <div>
                        <input name="email" id="email" className="form-control"
                          value={fields.email} onChange={handleInputChange}/>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="mobile" className="control-label">
                        Mobile <small className="text-muted">Format: 04xx xxx xxx</small>
                      </label>
                      <input name="mobile" id="mobile" className="form-control"
                        value={fields.mobile} onChange={handleInputChange} />
                      {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
                    </div>
                  </div>
                  <div className="col-12">
                    <h6 className="my-2 text-primary">Address</h6>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="street" className="control-label">Street</label>
                      <input name="street" id="street" className="form-control"
                        value={fields.street} onChange={handleInputChange} />
                      {errors.street && <div className="text-danger">{errors.street}</div>}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="city" className="control-label">City</label>
                      <input name="city" id="city" className="form-control"
                        value={fields.city} onChange={handleInputChange} />
                      {errors.city && <div className="text-danger">{errors.city}</div>}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="state" className="control-label">State</label>
                      <select name="state" id="state" className="form-control"
                        value={fields.state} onChange={handleInputChange}>
                        <option value="">None</option>
                        <option>ACT</option>
                        <option>NSW</option>
                        <option>NT</option>
                        <option>QLD</option>
                        <option>SA</option>
                        <option>TAS</option>
                        <option>VIC</option>
                        <option>WA</option>
                      </select>
                      {errors.state && <div className="text-danger">{errors.state}</div>}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="postcode" className="control-label">Postcode</label>
                      <input name="postcode" id="postcode" className="form-control"
                        value={fields.postcode} onChange={handleInputChange} />
                      {errors.postcode && <div className="text-danger">{errors.postcode}</div>}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group text-md-right">
                      <Link className="btn btn-secondary mr-5" to="/">Cancel</Link>
                      <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
