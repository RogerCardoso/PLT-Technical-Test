import React, { Component } from 'react';

class ColourFilter extends Component {

    constructor(props) {
        super();
        this.state = {
            selectedValue: '',
        }
    }

    /** Handles filter and pushes callback with current value */    
    handleChange = (e) => {
        this.setState({ selectedValue: e.target.value }, () => this.props.filter(this.state.selectedValue));
    }
    
    render() {
        const { selectedValue } = this.state;
        return(
            <div className="row my-5">
                <div className="col-12">
                    <p className="pl-3 d-inline">Colour filter: </p>
                    <select
                        value={selectedValue}
                        onChange={this.handleChange}
                    >
                        <option value=''>All colours</option>
                        {this.props.colours.map((colour, index) => {
                                return <option key={index }value={colour}>{colour}</option>
                            }                                
                        )}
                    </select>
                </div>
            </div>
        )
    }
}

export default ColourFilter;