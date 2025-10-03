// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract AnonymousResearchEthicsReview is SepoliaConfig {

    address public admin;
    uint32 public nextProposalId;
    uint32 public nextReviewerId;

    enum ProposalStatus { Submitted, UnderReview, Approved, Rejected, RequiresRevision }
    enum ReviewerRole { Junior, Senior, Expert }

    struct ResearchProposal {
        euint8 encryptedRiskLevel; // 1-10 scale, encrypted
        euint8 encryptedEthicsScore; // 1-100 scale, encrypted
        bool isActive;
        ProposalStatus status;
        uint256 submissionTime;
        uint256 reviewDeadline;
        uint32 assignedReviewers;
        uint32 completedReviews;
        address submitter;
    }

    struct AnonymousReviewer {
        euint8 encryptedExperienceLevel; // 1-20 years, encrypted
        ReviewerRole role;
        bool isActive;
        bool isAvailable;
        uint256 totalReviews;
        uint256 registrationTime;
        euint32 encryptedQualificationScore; // 1-1000, encrypted
    }

    struct ConfidentialReview {
        euint8 encryptedEthicsRating; // 1-10 scale
        euint8 encryptedRiskAssessment; // 1-10 scale
        euint8 encryptedRecommendation; // 1=reject, 2=revise, 3=approve
        bool isCompleted;
        uint256 submissionTime;
        euint32 encryptedReviewerScore; // Internal scoring
    }

    mapping(uint32 => ResearchProposal) public proposals;
    mapping(uint32 => AnonymousReviewer) public reviewers;
    mapping(uint32 => mapping(uint32 => ConfidentialReview)) public reviews; // proposalId => reviewerId => review
    mapping(uint32 => uint32[]) public proposalReviewers; // proposalId => reviewerIds
    mapping(address => uint32) public submitterToProposal; // Latest proposal per submitter

    event ProposalSubmitted(uint32 indexed proposalId, address indexed submitter, uint256 deadline);
    event ReviewerRegistered(uint32 indexed reviewerId, ReviewerRole role);
    event ReviewAssigned(uint32 indexed proposalId, uint32 indexed reviewerId);
    event ReviewSubmitted(uint32 indexed proposalId, uint32 indexed reviewerId);
    event ProposalStatusUpdated(uint32 indexed proposalId, ProposalStatus newStatus);
    event EthicsDecisionReached(uint32 indexed proposalId, ProposalStatus finalDecision);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier validProposal(uint32 _proposalId) {
        require(_proposalId > 0 && _proposalId < nextProposalId, "Invalid proposal ID");
        require(proposals[_proposalId].isActive, "Proposal not active");
        _;
    }

    modifier validReviewer(uint32 _reviewerId) {
        require(_reviewerId > 0 && _reviewerId < nextReviewerId, "Invalid reviewer ID");
        require(reviewers[_reviewerId].isActive, "Reviewer not active");
        _;
    }

    constructor() {
        admin = msg.sender;
        nextProposalId = 1;
        nextReviewerId = 1;
    }

    // Submit research proposal for ethics review
    function submitResearchProposal(
        uint8 _riskLevel,
        uint8 _ethicsScore,
        uint256 _reviewPeriodDays
    ) external returns (uint32 proposalId) {
        require(_riskLevel >= 1 && _riskLevel <= 10, "Risk level must be 1-10");
        require(_ethicsScore >= 1 && _ethicsScore <= 100, "Ethics score must be 1-100");
        require(_reviewPeriodDays >= 7 && _reviewPeriodDays <= 90, "Review period 7-90 days");

        proposalId = nextProposalId++;

        // Encrypt sensitive proposal data
        euint8 encryptedRisk = FHE.asEuint8(_riskLevel);
        euint8 encryptedEthics = FHE.asEuint8(_ethicsScore);

        proposals[proposalId] = ResearchProposal({
            encryptedRiskLevel: encryptedRisk,
            encryptedEthicsScore: encryptedEthics,
            isActive: true,
            status: ProposalStatus.Submitted,
            submissionTime: block.timestamp,
            reviewDeadline: block.timestamp + (_reviewPeriodDays * 1 days),
            assignedReviewers: 0,
            completedReviews: 0,
            submitter: msg.sender
        });

        submitterToProposal[msg.sender] = proposalId;

        // Set ACL permissions
        FHE.allowThis(encryptedRisk);
        FHE.allowThis(encryptedEthics);
        FHE.allow(encryptedRisk, msg.sender);
        FHE.allow(encryptedEthics, msg.sender);

        emit ProposalSubmitted(proposalId, msg.sender, proposals[proposalId].reviewDeadline);

        return proposalId;
    }

    // Register as anonymous ethics reviewer
    function registerAsReviewer(
        uint8 _experienceYears,
        ReviewerRole _role,
        uint32 _qualificationScore
    ) external returns (uint32 reviewerId) {
        require(_experienceYears >= 1 && _experienceYears <= 20, "Experience 1-20 years");
        require(_qualificationScore >= 1 && _qualificationScore <= 1000, "Qualification score 1-1000");

        reviewerId = nextReviewerId++;

        // Encrypt reviewer credentials
        euint8 encryptedExperience = FHE.asEuint8(_experienceYears);
        euint32 encryptedQualification = FHE.asEuint32(_qualificationScore);

        reviewers[reviewerId] = AnonymousReviewer({
            encryptedExperienceLevel: encryptedExperience,
            role: _role,
            isActive: true,
            isAvailable: true,
            totalReviews: 0,
            registrationTime: block.timestamp,
            encryptedQualificationScore: encryptedQualification
        });

        // Set ACL permissions
        FHE.allowThis(encryptedExperience);
        FHE.allowThis(encryptedQualification);
        FHE.allow(encryptedExperience, msg.sender);
        FHE.allow(encryptedQualification, msg.sender);

        emit ReviewerRegistered(reviewerId, _role);

        return reviewerId;
    }

    // Assign reviewers to proposal (admin function)
    function assignReviewersToProposal(
        uint32 _proposalId,
        uint32[] calldata _reviewerIds
    ) external onlyAdmin validProposal(_proposalId) {
        require(_reviewerIds.length >= 2 && _reviewerIds.length <= 5, "Need 2-5 reviewers");
        require(proposals[_proposalId].status == ProposalStatus.Submitted, "Proposal not in submitted status");

        for (uint i = 0; i < _reviewerIds.length; i++) {
            uint32 reviewerId = _reviewerIds[i];
            require(reviewers[reviewerId].isActive && reviewers[reviewerId].isAvailable, "Reviewer not available");

            proposalReviewers[_proposalId].push(reviewerId);
            emit ReviewAssigned(_proposalId, reviewerId);
        }

        proposals[_proposalId].assignedReviewers = uint32(_reviewerIds.length);
        proposals[_proposalId].status = ProposalStatus.UnderReview;

        emit ProposalStatusUpdated(_proposalId, ProposalStatus.UnderReview);
    }

    // Submit anonymous review
    function submitAnonymousReview(
        uint32 _proposalId,
        uint32 _reviewerId,
        uint8 _ethicsRating,
        uint8 _riskAssessment,
        uint8 _recommendation
    ) external validProposal(_proposalId) validReviewer(_reviewerId) {
        require(proposals[_proposalId].status == ProposalStatus.UnderReview, "Proposal not under review");
        require(_ethicsRating >= 1 && _ethicsRating <= 10, "Ethics rating 1-10");
        require(_riskAssessment >= 1 && _riskAssessment <= 10, "Risk assessment 1-10");
        require(_recommendation >= 1 && _recommendation <= 3, "Recommendation 1-3");
        require(!reviews[_proposalId][_reviewerId].isCompleted, "Review already submitted");
        require(block.timestamp <= proposals[_proposalId].reviewDeadline, "Review deadline passed");

        // Verify reviewer is assigned to this proposal
        bool isAssigned = false;
        uint32[] memory assignedReviewers = proposalReviewers[_proposalId];
        for (uint i = 0; i < assignedReviewers.length; i++) {
            if (assignedReviewers[i] == _reviewerId) {
                isAssigned = true;
                break;
            }
        }
        require(isAssigned, "Reviewer not assigned to this proposal");

        // Encrypt review data
        euint8 encryptedEthicsRating = FHE.asEuint8(_ethicsRating);
        euint8 encryptedRiskAssessment = FHE.asEuint8(_riskAssessment);
        euint8 encryptedRecommendation = FHE.asEuint8(_recommendation);

        // Generate reviewer performance score
        euint32 reviewerScore = FHE.randEuint32();

        reviews[_proposalId][_reviewerId] = ConfidentialReview({
            encryptedEthicsRating: encryptedEthicsRating,
            encryptedRiskAssessment: encryptedRiskAssessment,
            encryptedRecommendation: encryptedRecommendation,
            isCompleted: true,
            submissionTime: block.timestamp,
            encryptedReviewerScore: reviewerScore
        });

        // Set ACL permissions
        FHE.allowThis(encryptedEthicsRating);
        FHE.allowThis(encryptedRiskAssessment);
        FHE.allowThis(encryptedRecommendation);
        FHE.allowThis(reviewerScore);

        proposals[_proposalId].completedReviews++;
        reviewers[_reviewerId].totalReviews++;

        emit ReviewSubmitted(_proposalId, _reviewerId);

        // Check if all reviews completed
        if (proposals[_proposalId].completedReviews >= proposals[_proposalId].assignedReviewers) {
            _processEthicsDecision(_proposalId);
        }
    }

    // Process final ethics decision based on encrypted reviews
    function _processEthicsDecision(uint32 _proposalId) private {
        // Request decryption of all reviews for this proposal
        uint32[] memory reviewerIds = proposalReviewers[_proposalId];
        bytes32[] memory cts = new bytes32[](reviewerIds.length * 3); // 3 encrypted values per review

        uint256 index = 0;
        for (uint i = 0; i < reviewerIds.length; i++) {
            uint32 reviewerId = reviewerIds[i];
            ConfidentialReview storage review = reviews[_proposalId][reviewerId];

            cts[index++] = FHE.toBytes32(review.encryptedEthicsRating);
            cts[index++] = FHE.toBytes32(review.encryptedRiskAssessment);
            cts[index++] = FHE.toBytes32(review.encryptedRecommendation);
        }

        // Request batch decryption
        FHE.requestDecryption(cts, this.processEthicsDecisionCallback.selector);
    }

    // Callback function to process decrypted review data
    function processEthicsDecisionCallback(
        uint256 requestId,
        bytes memory cleartexts,
        bytes memory decryptionProof
    ) external {
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        // Decode ABI-encoded cleartexts
        uint8[] memory decryptedValues = abi.decode(cleartexts, (uint8[]));

        // Process decrypted review values and make ethics decision
        // This is a simplified implementation
        uint256 totalEthicsScore = 0;
        uint256 totalRiskScore = 0;
        uint256 approveCount = 0;
        uint256 rejectCount = 0;
        uint256 reviseCount = 0;

        uint256 reviewCount = decryptedValues.length / 3;

        for (uint256 i = 0; i < reviewCount; i++) {
            uint8 ethicsRating = decryptedValues[i * 3];
            uint8 riskAssessment = decryptedValues[i * 3 + 1];
            uint8 recommendation = decryptedValues[i * 3 + 2];

            totalEthicsScore += ethicsRating;
            totalRiskScore += riskAssessment;

            if (recommendation == 1) rejectCount++;
            else if (recommendation == 2) reviseCount++;
            else if (recommendation == 3) approveCount++;
        }

        // Determine final decision based on majority vote and average scores
        ProposalStatus finalStatus;
        if (rejectCount > reviewCount / 2) {
            finalStatus = ProposalStatus.Rejected;
        } else if (approveCount > reviewCount / 2 && totalEthicsScore / reviewCount >= 7) {
            finalStatus = ProposalStatus.Approved;
        } else {
            finalStatus = ProposalStatus.RequiresRevision;
        }

        // Update proposal status (simplified - in practice, would need to identify which proposal)
        // This would require storing requestId mapping to proposalId
        emit EthicsDecisionReached(0, finalStatus); // Placeholder
    }

    // Get proposal information (public data only)
    function getProposalInfo(uint32 _proposalId) external view validProposal(_proposalId) returns (
        ProposalStatus status,
        uint256 submissionTime,
        uint256 reviewDeadline,
        uint32 assignedReviewers,
        uint32 completedReviews,
        address submitter
    ) {
        ResearchProposal storage proposal = proposals[_proposalId];
        return (
            proposal.status,
            proposal.submissionTime,
            proposal.reviewDeadline,
            proposal.assignedReviewers,
            proposal.completedReviews,
            proposal.submitter
        );
    }

    // Get reviewer public information
    function getReviewerInfo(uint32 _reviewerId) external view validReviewer(_reviewerId) returns (
        ReviewerRole role,
        bool isActive,
        bool isAvailable,
        uint256 totalReviews,
        uint256 registrationTime
    ) {
        AnonymousReviewer storage reviewer = reviewers[_reviewerId];
        return (
            reviewer.role,
            reviewer.isActive,
            reviewer.isAvailable,
            reviewer.totalReviews,
            reviewer.registrationTime
        );
    }

    // Get review status for a proposal
    function getReviewProgress(uint32 _proposalId) external view validProposal(_proposalId) returns (
        uint32[] memory assignedReviewerIds,
        bool[] memory reviewCompleted
    ) {
        uint32[] memory reviewerIds = proposalReviewers[_proposalId];
        bool[] memory completed = new bool[](reviewerIds.length);

        for (uint i = 0; i < reviewerIds.length; i++) {
            completed[i] = reviews[_proposalId][reviewerIds[i]].isCompleted;
        }

        return (reviewerIds, completed);
    }

    // Admin function to update reviewer availability
    function updateReviewerAvailability(uint32 _reviewerId, bool _isAvailable) external onlyAdmin validReviewer(_reviewerId) {
        reviewers[_reviewerId].isAvailable = _isAvailable;
    }

    // Admin function to deactivate proposal
    function deactivateProposal(uint32 _proposalId) external onlyAdmin validProposal(_proposalId) {
        proposals[_proposalId].isActive = false;
        emit ProposalStatusUpdated(_proposalId, ProposalStatus.Rejected);
    }
}