import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import {
  Search, Dropdown, Form, Label,
} from 'semantic-ui-react';

import { categoryIdsToObjects } from './CategoryIdsToOjbects'
import CategoryInfoModal from './CategoryInfoModal';

const source = require('./UNSPCSearch.json');

const initialState = {
  loading: false,
  results: [],
  value: '',
};

function searchReducer(state, action) {
  switch (action.type) {
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query };
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results };
    default:
      throw new Error();
  }
}

function getCatText(values) {
  if (values.length === 0) {
    return ('Select Categories');
  }
  return (`${values.length} Categories Selected`);
}

const resultRenderer = ({ text }) => <Label content={text} />;

function CategorySearch() {
  const [categories, setCategories] = useState([])
  const [state, dispatch] = React.useReducer(searchReducer, initialState);
  const [modalOpen, setModal] = React.useState(false);
  const { loading, results } = state;

  const onSelect = useCallback(
    (category) => setCategories([...categories, category.code]),
    [categories, setCategories],
  );

  const onRemove = useCallback(
    (category) => setCategories(categories.filter((c) => c !== category.code)),
    [categories, setCategories],
  );

  const timeoutRef = React.useRef();
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current);
    dispatch({ type: 'START_SEARCH', query: data.value });

    timeoutRef.current = setTimeout(() => {
      const re = new RegExp(_.escapeRegExp(data.value), 'i');
      const isMatch = (result) => re.test(result.text);

      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(source.content, isMatch),
      });
    }, 50);
  }, []);

  React.useEffect(() => () => {
    clearTimeout(timeoutRef.current);
  }, []);

  const handleResultSelect = (e, data) => {
    onSelect(data.result);
  };

  const removeSelected = () => {
    const resultCodes = categoryIdsToObjects(categories).map((value) => value.code);
    const filteredResults = results.slice(0, 200).filter((cat) => !resultCodes.includes(cat.code));
    return filteredResults.slice(0, 10);
  };

  const toggleModal = () => {
    setModal(!modalOpen);
  };

  return (
    <Form.Dropdown
      text={getCatText(categories)}
      closeOnChange={false}
      fluid
      floating
      button
    >
      <Dropdown.Menu>
        <Dropdown.Item>
          <Search
            loading={loading}
            onResultSelect={handleResultSelect}
            onSearchChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.keyCode === 32) {
                // eslint-disable-next-line no-shadow
                const { value } = e.target;
                const index = e.target.selectionStart;
                e.target.value = `${value.slice(0, index)} ${value.slice(index)}`;
                e.target.selectionStart = index + 1;
                e.target.selectionEnd = index + 1;
              }
            }} // Fix to stop spacebar not being recorded
            resultRenderer={resultRenderer}
            results={removeSelected()} // Only show first few results
            onClick={(e) => e.stopPropagation()} // Prevent from closing early
            value={state.value}
          />
        </Dropdown.Item>
        <Dropdown.Item icon="question circle" text="Learn more" onClick={() => toggleModal()} />
        <Dropdown.Divider />
        <Dropdown.Menu scrolling>
          {categories.length !== 0 ? (categoryIdsToObjects(categories).map((result) => (
            <Dropdown.Item key={result.text} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => onRemove(result)}>
                {result.text} ␡
              </button>
            </Dropdown.Item>
          ))) : (
              <Dropdown.Item>
                Nothing selected
              </Dropdown.Item>
            )}
        </Dropdown.Menu>
        <CategoryInfoModal open={modalOpen} toggle={() => toggleModal()} />
      </Dropdown.Menu>
    </Form.Dropdown>
  );
}

export default CategorySearch;
