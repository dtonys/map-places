// in src/Places.js
import React from 'react';
import {
  List,
  Edit,
  Create,
  Datagrid,
  TextField,
  EditButton,
  SimpleForm,
  TextInput,
  Filter,
  Responsive,
  SimpleList,
} from 'admin-on-rest';


const PlaceFilter = (props) => (
  <Filter {...props}>
    <TextInput label="name" source="name" alwaysOn />
  </Filter>
);

export const PlaceList = (props) => (
  <List
    {...props}
    filters={<PlaceFilter />}
    perPage={10}
  >
    <Responsive
      small={
        <SimpleList
          primaryText={record => record.name }
        />
      }
      medium={
        <Datagrid>
          <TextField source="name" />
          <TextField label="longitude" source="coordinates.0" />
          <TextField label="latitude" source="coordinates.1" />
          <EditButton />
        </Datagrid>
      }
    >
    </Responsive>
  </List>
);

export const PlaceEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput label="longitude" source="coordinates.0" />
      <TextInput label="latitude" source="coordinates.1" />
    </SimpleForm>
  </Edit>
);

export const PlaceCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput label="longitude" source="coordinates.0" />
      <TextInput label="latitude" source="coordinates.1" />
    </SimpleForm>
  </Create>
);

