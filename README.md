# Anonymous Research Ethics Review Platform

A decentralized platform for conducting confidential peer review of research ethics proposals using Fully Homomorphic Encryption (FHE) technology on blockchain.

## 🔬 Overview

The Anonymous Research Ethics Review Platform revolutionizes the research ethics approval process by providing a transparent yet privacy-preserving system for evaluating research proposals. Using advanced FHE smart contracts, the platform ensures that sensitive ethical assessments remain confidential while maintaining the integrity and verifiability of the review process.

## 🎯 Core Concepts

### Privacy-Preserving Ethics Assessment

This platform addresses a critical challenge in research ethics: maintaining reviewer anonymity and protecting sensitive evaluation data while ensuring accountability and transparency in the decision-making process.

**Key Privacy Features:**
- **Encrypted Risk Assessments**: Research risk levels (1-10 scale) are encrypted using FHE, ensuring only authorized parties can access sensitivity scores
- **Confidential Ethics Scores**: Self-assessed ethics compliance scores (1-100 scale) remain private during the review process
- **Anonymous Reviewer Credentials**: Reviewer qualifications and experience levels are encrypted to prevent bias
- **Private Review Ratings**: Individual ethics ratings and risk assessments from reviewers are encrypted until final decision

### FHE Smart Contract Architecture

The platform leverages Fully Homomorphic Encryption through the fhEVM library, enabling computation on encrypted data without revealing the underlying information.

**Contract Address (Sepolia Testnet):**
```
0x96104da4AEfA1ba63ab994d87143Cf2130E06ef8
```

**Core FHE Operations:**
1. **Encrypted Proposal Submission**: Research proposals include encrypted risk levels and ethics scores
2. **Anonymous Reviewer Registration**: Reviewers register with encrypted experience levels and qualification scores
3. **Confidential Review Process**: All review ratings and assessments are encrypted on-chain
4. **Privacy-Preserving Decision Making**: Final ethics decisions are computed using FHE operations on encrypted review data

### Workflow

**1. Research Proposal Submission**
- Researchers submit proposals with encrypted risk and ethics assessments
- Review deadline is established (7-90 days)
- Proposal enters "Submitted" status

**2. Reviewer Assignment**
- Platform administrators assign 2-5 qualified reviewers to each proposal
- Reviewers are selected based on encrypted qualification scores
- Proposal status updates to "Under Review"

**3. Anonymous Review Process**
- Assigned reviewers submit confidential evaluations including:
  - Ethics rating (1-10): Compliance with ethical standards
  - Risk assessment (1-10): Potential risks to participants or community
  - Recommendation: Reject, Requires Revision, or Approve

**4. Automated Decision**
- Once all reviews are submitted, the smart contract processes encrypted data
- Final decision reached through majority voting mechanism
- Proposal status updated to: Approved, Rejected, or Requires Revision

## 🎥 Demo

Watch the platform in action: [Demo Video](./AnonymousResearchEthicsReview.mp4)

Experience the live application: [https://anonymous-research-ethics-review.vercel.app/](https://anonymous-research-ethics-review.vercel.app/)

## 🏗️ Technical Architecture

### Smart Contract Components

**Data Structures:**
- `ResearchProposal`: Contains encrypted risk levels, ethics scores, and review metadata
- `AnonymousReviewer`: Stores encrypted reviewer credentials and performance metrics
- `ConfidentialReview`: Holds encrypted review ratings and recommendations

**Key Functions:**
- `submitResearchProposal()`: Submit new proposal with encrypted data
- `registerAsReviewer()`: Register as reviewer with encrypted credentials
- `submitAnonymousReview()`: Submit confidential review assessment
- `assignReviewersToProposal()`: Admin function to assign reviewers
- `processEthicsDecision()`: Automated decision making on encrypted reviews

### Privacy Guarantees

**Access Control:**
- FHE ACL (Access Control List) system manages who can decrypt specific data
- Proposal submitters can only decrypt their own proposal data
- Reviewers cannot see other reviewers' assessments
- Platform admin cannot access encrypted review content

**Decryption Flow:**
- Individual encrypted values require proper authorization
- Final decisions use FHE batch decryption with cryptographic proof validation
- All decryption operations are logged on-chain for auditability

## 🔐 Security Features

- **Zero-Knowledge Review**: Reviewers remain anonymous to prevent retaliation or bias
- **Tamper-Proof Records**: All proposals and reviews are immutably stored on blockchain
- **Verifiable Randomness**: Reviewer performance scores use verifiable random functions
- **Multi-Reviewer Consensus**: Requires 2-5 independent reviews for decision validity
- **Time-Locked Reviews**: Enforced deadlines prevent review manipulation

## 🌟 Use Cases

### Academic Research Ethics Boards
- University IRB (Institutional Review Board) evaluations
- Multi-institutional collaborative research approvals
- International ethics committee reviews

### Clinical Trial Ethics
- Pharmaceutical research ethics assessment
- Medical device trial approvals
- Patient safety protocol reviews

### Social Science Research
- Human subjects research evaluation
- Sensitive population study approvals
- Data privacy compliance reviews

### Corporate Research Ethics
- Internal ethics committee decisions
- Cross-border research compliance
- Stakeholder impact assessments

## 🚀 Getting Started

### Prerequisites
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for gas fees
- Access to Sepolia RPC endpoint

### Quick Start

1. **Connect Wallet**
   - Visit the platform URL
   - Click "Connect Wallet"
   - Approve MetaMask connection
   - Ensure you're on Sepolia testnet

2. **Submit a Research Proposal**
   - Enter risk level (1-10)
   - Provide ethics self-assessment score (1-100)
   - Set review period (7-90 days)
   - Submit transaction

3. **Register as Reviewer**
   - Enter years of experience (1-20)
   - Select role: Junior, Senior, or Expert
   - Provide qualification score (1-1000)
   - Complete registration

4. **Submit Review** (for assigned reviewers)
   - Enter proposal ID
   - Provide your reviewer ID
   - Rate ethics compliance (1-10)
   - Assess research risks (1-10)
   - Make recommendation: Reject, Revise, or Approve

## 📊 Platform Statistics

The dashboard displays real-time metrics:
- **Total Proposals**: Number of research proposals submitted
- **Registered Reviewers**: Active ethics reviewers in the system
- **Active Reviews**: Proposals currently under review
- **Completed Reviews**: Total number of reviews submitted

## 🔗 Resources

- **GitHub Repository**: [https://github.com/IsobelRosenbaum/AnonymousResearchEthicsReview](https://github.com/IsobelRosenbaum/AnonymousResearchEthicsReview)
- **Live Application**: [https://anonymous-research-ethics-review.vercel.app/](https://anonymous-research-ethics-review.vercel.app/)
- **Smart Contract**: [View on Etherscan](https://sepolia.etherscan.io/address/0x96104da4AEfA1ba63ab994d87143Cf2130E06ef8)

## 🤝 Contributing

We welcome contributions to improve the Anonymous Research Ethics Review Platform. Whether it's bug fixes, feature enhancements, or documentation improvements, your input is valuable.

## 📄 License

MIT License - Open source and free to use

## 🙏 Acknowledgments

Built with:
- **fhEVM**: Zama's Fully Homomorphic Encryption Virtual Machine
- **Solidity**: Smart contract programming language
- **Ethers.js**: Ethereum JavaScript library
- **Sepolia**: Ethereum testnet for development and testing

---

**Empowering ethical research through privacy-preserving technology** 🔬🔐
