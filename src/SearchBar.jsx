import _ from 'lodash';
import React, { useEffect, useState, useCallback } from 'react';
import { categoryIdsToObjects } from './CategoryIdsToOjbects';
const source = require('./UNSPCSearch.json');

function getCatText(values) {
  if (values.length === 0) {
    return 'Select Categories';
  }
  return `${values.length} Categories Selected`;
}

export default function SearchBar() {
  const [value, setValue] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const re = new RegExp(_.escapeRegExp(value), 'i');
    const isMatch = (result) => re.test(result.text);
    const results = _.filter(source.content, isMatch);

    const resultCodes = categoryIdsToObjects(categories).map(
      (value) => value.code
    );
    const filteredResults = results
      .slice(0, 200)
      .filter((cat) => !resultCodes.includes(cat.code));

    setSearchResults(filteredResults.slice(0, 10));
  }, [value, categories]);

  const onSelect = useCallback(
    (category) => setCategories([...categories, category.code]),
    [categories, setCategories]
  );

  const onRemove = useCallback(
    (category) => setCategories(categories.filter((c) => c !== category.code)),
    [categories, setCategories]
  );
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <div
        style={{
          display: 'block',
          marginRight: '20px',
        }}
      >
        <input value={value} onChange={(e) => setValue(e.target.value)}></input>
        <ul>
          {searchResults.map((value) => {
            return (
              <li
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => onSelect(value)}
              >
                {value.text}
              </li>
            );
          })}
        </ul>
      </div>
      <section>
        <h3>{getCatText(categories)}</h3>
        <ul
          style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <li
            style={{
              cursor: 'pointer',
            }}
          >
            {categoryIdsToObjects(categories).map((category) => {
              return (
                <li onClick={() => onRemove(category)}>{category.text}</li>
              );
            })}
          </li>
        </ul>
      </section>
    </div>
  );
}
