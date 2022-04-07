// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is ERC721, Ownable, Pausable {
  using Strings for uint256;
  using Counters for Counters.Counter;
  
  Counters.Counter private _tokenIdCounter;

  uint8 public maxMintAmount = 1;
  uint16 public constant TOTAL_SUPPLY = 84;
  uint256 public cost = 0 ether;
  bool private isRevealed = false;
  string public baseURI = "";
  string public notRevealedURI = "";
  string private constant extension = ".json";

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI,
    string memory _initNotRevealedURI
  ) ERC721(_name, _symbol) {
    setBaseURL(_initBaseURI);
    setNotRevealedURI(_initNotRevealedURI);
  }

  function mint(address to, uint8 mintAmount) public payable whenNotPaused {
    require(mintAmount > 0);
    require(mintAmount <= maxMintAmount, "cannot exceed maxMintAmount");
    require(mintAmount <= TOTAL_SUPPLY - _tokenIdCounter.current());
    require(mintAmount * cost <= msg.value);
    
    for (uint8 i = 0; i < maxMintAmount; i++) {
      // filename starts with 1
      _tokenIdCounter.increment();
      _safeMint(to, _tokenIdCounter.current());
    }
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    if (isRevealed == false) {
      return notRevealedURI;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0 ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), extension)) : "";
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  function setRevealedTrue() external onlyOwner {
    isRevealed = true;
  }

  function switchPaused(bool status) public onlyOwner {
    if (status == true) {
      _pause();
    } else {
      _unpause();
    }
  }

  function setBaseURL(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    notRevealedURI = _notRevealedURI;
  }

  function setCost(uint256 _newCost) public onlyOwner {
    cost = _newCost;
  }

  function setMaxMintAmount(uint8 _newMintAmount) public onlyOwner {
    maxMintAmount = _newMintAmount;
  }
}