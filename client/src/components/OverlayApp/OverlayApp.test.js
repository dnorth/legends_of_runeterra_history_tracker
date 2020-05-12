import { shallow } from 'enzyme'
import React from 'react'
import OverlayApp from './OverlayApp'

test('renders without failing', ()=>{
    let wrapper = shallow(<OverlayApp />)

    expect(wrapper).toBeDefined()
})

test('able to change theme based on context',()=>{
    let wrapper = shallow(<OverlayApp />)
    let instance = wrapper.instance()

    expect(wrapper.state('theme')).toEqual('light')
    instance.contextUpdate({theme:'dark'},['theme'])
    expect(wrapper.state('theme')).toEqual('dark')
})
