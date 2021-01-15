import React, { Component } from 'react';

import { ColourFilter } from '../components';

class Basket extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            isLoading: true,
            filter: '',

        }
        this.handleItem = this.handleItem.bind(this);
    }

    /** API request and state prep */
    componentDidMount() {
        fetch('https://my-json-server.typicode.com/benirvingplt/products/products')
            .then( response => response.json() )
            .then( data => { 
                    if (data.length > 0) this.setState({ products: data});
                    this.setState({ isLoading: false });
                }
            )
            .catch( error => { 
                console.log(error);
                this.setState({ isLoading: false });
            });        
    }
    
    /** Handles basket buttons */
    handleItem = (index, action) => {
        let basket = this.state.products;
        let product = this.state.products[index];

        switch(action) {
            case 'add':
                if(!product.qty) {
                    product.qty = 1;
                } else {
                    product.qty = product.qty + 1;
                }
                break;
            case 'red':
                if(product.qty > 1) {
                    product.qty = product.qty - 1;
                } else {                    
                    product.qty = null;
                }
                break;
            case 'remove':
                product.qty = null;
                break;
            default:
                break;        }

        
        basket[index] = product;
        this.setState({ products: basket }, () => console.log(this.state));
    }

    /** Get available colours from API */
    getColours = () => {
        let availableColours = [];
        this.state.products.forEach(product => (
                !availableColours.includes(product.colour) && availableColours.push(product.colour)
            )
        )
        return availableColours;   
    }

    /** Calculates total based on product array, qty x cost */
    getTotal = () => {
        let total = 0;
        this.state.products.forEach(product => {
            if(product.qty) {
                total = total + (product.qty * parseInt(product.price))
            }
        })
        return total.toFixed(2);
    }
    
    render() {
        const { products, isLoading, filter } = this.state;

        if(isLoading) return <h1 className="mt-5 text-center">Loading...</h1>
        
        return(
            <div className="container">
                <ColourFilter 
                    colours={this.getColours()} 
                    filter={(colour) => { this.setState({ filter: colour })}}
                />
                {products.length < 1 && (
                    <h4>You have no products in your cart.</h4>
                )
                }
                {products.length > 0 &&
                    products.map((product, index) => {
                        if(filter !== '' && product.colour !== filter) return '';
                        return (
                            <div className="d-flex product my-3" key={index}>
                                <div className="col-3 text-center">
                                    <img className="product-img" src={product.img} alt={product.name}/>
                                </div>
                                <div className="col-6 col-md-4 my-auto">
                                    <h5>{product.name}</h5>
                                    <p className="text-right">£{parseInt(product.price).toFixed(2)}</p>
                                </div>
                                <div className="col-3 ml-auto text-center my-auto">
                                    <p className="mb-0">
                                        {product.qty && 
                                            <span 
                                                className="qty-button mr-3"
                                                onClick={(e) => this.handleItem(index, 'red')}
                                            >
                                                -
                                            </span>
                                        }
                                        {product.qty ? product.qty : 0}
                                        <span className="qty-button ml-3"
                                            onClick={(e) => this.handleItem(index, 'add')}>
                                            +
                                        </span>
                                    </p>
                                    {product.qty && 
                                        <p 
                                            className="small remove-button d-inline"
                                            onClick={(e) => this.handleItem(index, 'remove')}>
                                                remove
                                        </p>
                                    }                                   
                                </div>
                            </div>
                        )
                    }
                )}
                
                {/* not clear if I should filter total together with the colour filter?*/}
                <div className="row text-center my-5">
                    <div className="col-3">
                        <h2>TOTAL</h2>
                    </div>
                    <div className="col-3 ml-auto">
                        <h2>£{this.getTotal()}</h2>
                    </div>
                </div>
            </div>
        )
    }
}

export default Basket;