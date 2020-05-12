import { shallow } from 'enzyme'
import React from 'react'
import PanelApp from './PanelApp'

test('renders without failing', ()=>{
    let wrapper = shallow(<PanelApp />)

    expect(wrapper).toBeDefined()
})

test('able to change theme based on context',()=>{
    let wrapper = shallow(<PanelApp />)
    let instance = wrapper.instance()

    expect(wrapper.state('theme')).toEqual('light')
    instance.contextUpdate({theme:'dark'},['theme'])
    expect(wrapper.state('theme')).toEqual('dark')
})
