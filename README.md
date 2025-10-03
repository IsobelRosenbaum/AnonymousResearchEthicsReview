# Anonymous Research Ethics Review Platform

A decentralized platform for confidential peer review of research ethics using Fully Homomorphic Encryption (FHE) on blockchain technology.

## 🌐 Live Demo

**Website:** [https://anonymous-research-ethics-review.vercel.app/](https://anonymous-research-ethics-review.vercel.app/)

**GitHub Repository:** [https://github.com/IsobelRosenbaum/AnonymousResearchEthicsReview](https://github.com/IsobelRosenbaum/AnonymousResearchEthicsReview)

**Demo Video:** [Watch Demo](AnonymousResearchEthicsReview.mp4)

## 📋 Overview

The Anonymous Research Ethics Review Platform revolutionizes how research ethics proposals are evaluated by combining blockchain transparency with privacy-preserving cryptography. Using Fully Homomorphic Encryption (FHE), sensitive research data and reviewer assessments remain confidential while maintaining the integrity of the peer review process.

## 🔑 Core Concepts

### Fully Homomorphic Encryption (FHE)

This platform leverages **FHE technology** to enable computations on encrypted data without ever decrypting it. This means:

- Research proposals' sensitive details (risk levels, ethics scores) remain encrypted on-chain
- Reviewer credentials and qualifications are protected
- Anonymous reviews are submitted and processed in encrypted form
- Final decisions are calculated on encrypted data, preserving complete confidentiality

### Anonymous Research Ethics Review - Privacy-Preserving Research Ethics Assessment

The platform provides a **privacy-first approach to research ethics evaluation**:

- **Confidential Submissions**: Researchers submit proposals with encrypted risk assessments and ethics scores
- **Anonymous Peer Review**: Reviewers evaluate proposals without revealing their identity or bias
- **Blind Evaluation**: Reviewers cannot see each other's assessments until finalization
- **Transparent Outcomes**: While data remains private, the review process is auditable on blockchain
- **Decentralized Governance**: No central authority controls the review process

## 🏗️ Smart Contract Architecture

### FHE-Enabled Contract

**Contract Address:** `0x96104da4AEfA1ba63ab994d87143Cf2130E06ef8`

**Network:** Sepolia Testnet

The smart contract implements:

```solidity
- Research Proposal Management (encrypted risk/ethics data)
- Anonymous Reviewer Registration (encrypted credentials)
- Confidential Review Submission (encrypted ratings)
- Automated Decision Processing (FHE computations)
- Role-Based Access Control
```

### Key Features

#### For Researchers
- **Submit Research Proposals** with encrypted risk and ethics assessments
- **Track Review Progress** without exposing sensitive details
- **Receive Final Decisions** with transparent justification

#### For Reviewers
- **Anonymous Registration** with encrypted qualifications
- **Confidential Evaluation** of proposals
- **Protected Identity** throughout the review process
- **Reputation System** without compromising anonymity

#### For Administrators
- **Assign Reviewers** to proposals based on encrypted qualifications
- **Monitor Review Progress** without accessing confidential data
- **Ensure Process Integrity** through blockchain immutability

## 🎯 Use Cases

### 1. Medical Research Ethics
Evaluate sensitive medical research proposals involving human subjects while protecting patient data and institutional identities.

### 2. Cross-Institutional Collaboration
Enable researchers from multiple institutions to participate in ethics review without revealing institutional affiliations or competitive research directions.

### 3. Whistleblower-Friendly Reviews
Allow anonymous submission of ethically questionable research practices for peer review without fear of retaliation.

### 4. International Research Standards
Facilitate global research ethics assessment while respecting regional privacy regulations (GDPR, HIPAA, etc.).

## 🔐 Privacy Guarantees

### What Remains Private (Encrypted)
- Research risk levels and ethics scores
- Reviewer experience and qualifications
- Individual review ratings and recommendations
- Interim decision calculations

### What Is Public (Transparent)
- Proposal submission timestamps
- Number of assigned reviewers
- Review completion status
- Final approval/rejection outcomes
- Contract audit trail

## 🎨 Technology Stack

- **Blockchain:** Ethereum (Sepolia Testnet)
- **Encryption:** Zama fhEVM (Fully Homomorphic Encryption)
- **Smart Contracts:** Solidity ^0.8.24
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Web3 Library:** ethers.js v5.7.2
- **Wallet Integration:** MetaMask

## 🚀 Getting Started

### Prerequisites

1. **MetaMask Wallet**: Install [MetaMask](https://metamask.io/) browser extension
2. **Sepolia Testnet**: Switch to Sepolia network in MetaMask
3. **Test ETH**: Obtain Sepolia ETH from [faucet](https://sepoliafaucet.com/)

### How to Use

#### 1. Connect Wallet
Click "Connect Wallet" button and approve MetaMask connection.

#### 2. Submit Research Proposal
- Navigate to "Submit Research Proposal" panel
- Enter **Risk Level** (1-10 scale)
- Enter **Ethics Score** (1-100 scale)
- Set **Review Period** (7-90 days)
- Click "Submit Proposal" and confirm transaction

#### 3. Register as Reviewer
- Navigate to "Register as Reviewer" panel
- Enter **Years of Experience** (1-20)
- Select **Reviewer Role** (Junior/Senior/Expert)
- Enter **Qualification Score** (1-1000)
- Click "Register as Reviewer" and confirm transaction

#### 4. Submit Review (For Assigned Reviewers)
- Navigate to "Submit Review" panel
- Enter **Proposal ID** to review
- Enter your **Reviewer ID**
- Rate **Ethics Compliance** (1-10)
- Assess **Research Risk** (1-10)
- Make **Recommendation** (Reject/Revise/Approve)
- Click "Submit Review" and confirm transaction

#### 5. Assign Reviewers (Admin Only)
- Navigate to "Admin Functions" panel
- Enter **Proposal ID**
- Enter **Reviewer IDs** (comma-separated, 2-5 reviewers)
- Click "Assign Reviewers" and confirm transaction

## 📊 Review Process Flow

```
1. Researcher submits encrypted proposal
   ↓
2. Admin assigns qualified reviewers (based on encrypted credentials)
   ↓
3. Reviewers submit anonymous encrypted evaluations
   ↓
4. Smart contract aggregates encrypted reviews using FHE
   ↓
5. Final decision calculated on encrypted data
   ↓
6. Decision published (Approved/Rejected/Requires Revision)
   ↓
7. Detailed reviews remain confidential
```

## 🎓 Educational Value

This platform demonstrates:

- **Real-world FHE application** in peer review systems
- **Privacy-preserving blockchain** use cases
- **Decentralized governance** for academic processes
- **Anonymous voting/rating** mechanisms
- **Encrypted data aggregation** techniques

## 🔬 Research Impact

### Benefits for Scientific Community

1. **Eliminates Bias**: Anonymous reviews prevent institutional, gender, or nationality bias
2. **Protects Whistleblowers**: Safe reporting of unethical research practices
3. **Enables Collaboration**: Researchers can seek ethics review without exposing IP
4. **Global Standards**: Decentralized platform accessible worldwide
5. **Immutable Records**: Permanent audit trail of ethics decisions

### Compliance Features

- **GDPR Compatible**: Encrypted personal data processing
- **HIPAA Considerations**: Medical research data protection
- **Research Ethics Boards**: Complementary tool for IRB/ERB processes
- **Conflict of Interest**: Automated detection through encrypted reviewer matching

## 🛡️ Security Features

- **End-to-End Encryption**: FHE ensures data never exists in plaintext on-chain
- **Non-Interactive Proofs**: Zama's fhEVM provides cryptographic guarantees
- **Tamper-Proof Records**: Blockchain immutability prevents data manipulation
- **Access Control**: Role-based permissions for different user types
- **Deadline Enforcement**: Smart contract ensures timely reviews

## 📈 Platform Statistics

The dashboard displays real-time metrics:
- **Total Proposals** submitted
- **Registered Reviewers** count
- **Active Reviews** in progress
- **Completed Reviews** finalized

## 🌟 Future Enhancements

- **AI-Assisted Matching**: ML algorithms for optimal reviewer-proposal pairing
- **Multi-Chain Support**: Expand to other blockchain networks
- **Token Incentives**: Reward reviewers for quality assessments
- **Reputation NFTs**: Issue certificates for reviewing contributions
- **Advanced Analytics**: Privacy-preserving statistics on review trends
- **Mobile Application**: Native mobile apps for iOS/Android

## 🤝 Contributing

We welcome contributions from the community! Areas for improvement:

- Enhanced UI/UX design
- Additional language support
- Smart contract optimizations
- Documentation improvements
- Testing and security audits

## 📞 Contact & Support

- **Issues**: Report bugs via [GitHub Issues](https://github.com/IsobelRosenbaum/AnonymousResearchEthicsReview/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/IsobelRosenbaum/AnonymousResearchEthicsReview/discussions)
- **Website**: [https://anonymous-research-ethics-review.vercel.app/](https://anonymous-research-ethics-review.vercel.app/)

## 🙏 Acknowledgments

This project utilizes:
- **Zama fhEVM**: For fully homomorphic encryption capabilities
- **Ethereum Foundation**: For blockchain infrastructure
- **OpenZeppelin**: For secure smart contract patterns
- **MetaMask**: For wallet integration

---

**Built with ❤️ for the global research community**

*Empowering anonymous, unbiased, and privacy-preserving research ethics review through blockchain and cryptography.*