import renderer from 'react-test-renderer'
import React from 'react'
import Button from '../button';

describe('button', ()=>{
  it('是个 div', ()=>{
    console.log('fuck', renderer)
    const json = renderer.create(<Button/>).toJSON();
    expect(json).toMatchSnapshot()
  })
});
