import React, { useState } from 'react';
import {
  Button,
} from '@material-ui/core';
import MRCForm from './MRCForm';

const MRC = () => {
  const [openForm, setOpenForm] = useState(false);
  const [initialValues, setFormData] = useState({
    // id: 0,
    // style: "",
    // unit_name: "",
    // plant_name: "",
    // line_name: "",
    // buyer_name: "",
    // start_date_only: new Date(),
    // end_date_only: new Date(),
    // swm: []

      id: '',
      style: 'a',
      unit: 'c',
      plant: 'v',
      line: 'b',
      buyer: 'v',
      start_date: new Date(),
      end_date: new Date(),
      swm: [
          {
              "id": 38609,
              "machine_type": 3,
              "machine_quantity": 3
          },
          {
              "id": 38610,
              "machine_type": 1,
              "machine_quantity": 3
          },
          {
              "id": 38611,
              "machine_type": 4,
              "machine_quantity": 1
          },
          {
              "id": 38612,
              "machine_type": 2,
              "machine_quantity": 4
          }
      ]
  });



  const handleSubmit = (values) => {
    // Handle form submission (insert or update logic)
    console.log(values);
    // You may want to update state or send data to the server here
  };

  return (
    <div>
      <h1>MRC Form</h1>
      <Button onClick={() => setOpenForm(true)}>Open Form</Button>
      <MRCForm open={openForm} handleClose={() => setOpenForm(false)} initialValues={initialValues} onSubmit={handleSubmit} />
      {/* <MRCForm initialValues={formData} onSubmit={handleSubmit} /> */}
    </div>
  );
};

export default MRC;
