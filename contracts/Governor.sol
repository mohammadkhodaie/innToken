// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "openzeppelin-solidity/contracts/utils/structs/EnumerableMap.sol";

contract Governor {
    using EnumerableSet for EnumerableSet.AddressSet;
    constructor(){

    }
    enum VoteType {
        Against,
        For,
        Abstain
    }

    struct ProposalVote {
        uint256 againstVotes;
        uint256 forVotes;
        uint256 abstainVotes;
        // mapping(address => bool) hasVoted; //TODO : enmurable map beshe ;D address + enum
        EnumerableSet.AddressSet  hasVoted;//for reward 

    }
    enum ProposalType {
        NewValidator , 
        NewProposal 
    }
    struct ProposalDetails {
                bytes32 descriptionHash;

        bytes32 startupID; 
        address proposer;
        address startup;
        uint32 tokenOffer;
        uint8 sharedStake; 
        // uint256 forVotes;
        // uint256 againstVotes;
        // uint256 abstainVotes;
        // mapping(address => Receipt) receipts;
        ProposalType proposalType;
    }

    mapping(uint256 => ProposalDetails) private _proposalDetails;
    mapping(address => bool ) hasAccessToVote ; 
    mapping(uint256 => ProposalVote) private _proposalVotes;

}