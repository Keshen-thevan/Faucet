//SPDX-License-Identifier:MIT
pragma solidity >=0.4.22 <0.9.0;


contract Faucet {

    mapping(address => bool) private funders;   //maps an address to a bool, all address are mapped to false be drfault
    mapping(uint => address) private lutFunders; //maps a uint to an address
    uint public numOfFunders;   //a uint to track the number of funders

    modifier withdrawLimit(uint _amount){
        require(_amount <= 2 ether, "Not enough funds in contract");
        _;
    }

    receive() external payable{}

    function addFunds() external payable{
        address funder = msg.sender;    //makes who ever is calling the function "funder"
        
        if(!funders[funder]){   //checks to see if the funder that calls is equal to false
            uint index = numOfFunders++;    //assigns index the number of funders
            funders[funder] = true;     //makes the bool assigned to the address equal to true
            lutFunders[index] = funder;     //assigns the funders address to the lutFunders mapping
        }
    }


    function withdraw(uint _amount) external withdrawLimit(_amount){
        payable(msg.sender).transfer(_amount);

    }

    function getFunderAtIndex(uint8 _index) external view returns(address){
        return lutFunders[_index];
    }

    function getAllFunders()external view returns (address[] memory){
        address[] memory _funders = new address[](numOfFunders);

        for(uint i = 0; i < numOfFunders; i++){
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }
}