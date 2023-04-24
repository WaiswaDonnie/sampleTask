import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import PickerSelect from 'react-native-picker-select';
import model1 from './data/model1.json';
import model2 from './data/model2.json';

const App = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({});

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setInputValues({});
    setCalculatedValues({});
  };

  const handleInputValueChange = (fieldName, value) => {
    setInputValues({ ...inputValues, [fieldName]: value });
  };

  const handleCalculate = () => {
    if (selectedModel) {
      const calculated = {};
      Object.entries(selectedModel.fields).forEach(([fieldName, fieldDef]) => {
        if (fieldDef.calculate) {
          const value = eval(fieldDef.calculate);
          calculated[fieldName] = value;
        }
      });
      setCalculatedValues(calculated);
    }
  };

  const renderInputField = (fieldName, fieldDef) => {
    return (
      <View key={fieldName}>
        <Text>{fieldDef.label}</Text>
        <TextInput
          value={inputValues[fieldName]}
          keyboardType={fieldDef.type === 'number' ? 'numeric' : 'default'}
          onChangeText={(value) => handleInputValueChange(fieldName, value)}
          editable={!fieldDef.readOnly}
        />
      </View>
    );
  };

  const renderModelFields = () => {
    return Object.entries(selectedModel.fields).map(([fieldName, fieldDef]) => {
      if (fieldDef.calculate) {
        return null;
      }
      return renderInputField(fieldName, fieldDef);
    });
  };

  const renderCalculatedField = (fieldName, value) => {
    return (
      <View key={fieldName}>
        <Text>{selectedModel.fields[fieldName].label}</Text>
        <Text>{value}</Text>
      </View>
    );
  };

  const renderCalculatedFields = () => {
    if (Object.keys(calculatedValues).length === 0) {
      return null;
    }
    return Object.entries(calculatedValues).map(([fieldName, value]) =>
      renderCalculatedField(fieldName, value)
    );
  };

  const modelOptions = [
    { label: 'Select a model', value: null },
    { label: model1.name, value: model1 },
    { label: model2.name, value: model2 },
  ];

  return (
    <View>
      <PickerSelect
        placeholder={{ label: 'Select a model', value: null }}
        items={modelOptions}
        value={selectedModel}
        onValueChange={handleModelSelect}
      />
      {selectedModel && (
        <View>
          {renderModelFields()}
          <Button title="Calculate" onPress={handleCalculate} />
          {renderCalculatedFields()}
        </View>
      )}
    </View>
  );
};
 
export default App;
