const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Blog", async function () {
  it("Should create a post", async function () {
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("My blog")
    await blog.deployed()
    await blog.createPost("My first post", "12345")
    const posts = await blog.fetchPosts()
    expect(posts[0].title).to.equal("My first post")
  })

  it("Should fail to create a post", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("My blog")
    await blog.deployed()
    await expect( 
      blog.connect(addr1).createPost("My first post", "12345")
    ).to.be.reverted 
  })

  it("Should edit a post", async function () {
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("My blog")
    await blog.deployed()
    await blog.createPost("My Second post", "12345")

    await blog.updatePost(1, "My updated post", "23456", true)

    posts = await blog.fetchPosts()
    expect(posts[0].title).to.equal("My updated post")
  })

  it("Should fail to edit a post", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("My blog")
    //Owner creates post
    await blog.deployed()
    await blog.createPost("My Third post", "12345")
    
    //Addr1 should fail to update
    await expect(
      blog.connect(addr1).updatePost(1, "My updated post", "23456", true)
    ).to.be.reverted

  })

  it("Should update the name", async function () {
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("My blog")
    await blog.deployed()

    expect(await blog.name()).to.equal("My blog")
    await blog.updateName('My new blog')
    expect(await blog.name()).to.equal("My new blog")
  })

  it("Should fail to update the name", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("My blog")
    await blog.deployed()

    //Addr1 should fail to update name
    expect(await blog.connect(addr1).name()).to.equal("My blog")
    await expect(
      blog.connect(addr1).updateName("My new blog")
    ).to.be.reverted
    expect(await blog.connect(addr1).name()).to.equal("My blog")
  })

  it("Should transfer ownership", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Blog = await ethers.getContractFactory("Blog")
    const blog = await Blog.deploy("My blog")
    const owner1 = await blog.owner()
    
    //Transfer blog
    await blog.transferOwnership(addr1.address)
    expect(await blog.owner()).to.equal(addr1.address)
  })
})