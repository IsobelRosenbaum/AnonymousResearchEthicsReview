// Anonymous Research Ethics Review DApp
class EthicsReviewApp {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.userAddress = null;

        // Contract configuration
        this.contractAddress = "0x96104da4AEfA1ba63ab994d87143Cf2130E06ef8"; // Sepolia deployment
        this.contractABI = [
            "function submitResearchProposal(uint8 _riskLevel, uint8 _ethicsScore, uint256 _reviewPeriodDays) external returns (uint32)",
            "function registerAsReviewer(uint8 _experienceYears, uint8 _role, uint32 _qualificationScore) external returns (uint32)",
            "function submitAnonymousReview(uint32 _proposalId, uint32 _reviewerId, uint8 _ethicsRating, uint8 _riskAssessment, uint8 _recommendation) external",
            "function assignReviewersToProposal(uint32 _proposalId, uint32[] calldata _reviewerIds) external",
            "function getProposalInfo(uint32 _proposalId) external view returns (uint8, uint256, uint256, uint32, uint32, address)",
            "function getReviewerInfo(uint32 _reviewerId) external view returns (uint8, bool, bool, uint256, uint256)",
            "function getReviewProgress(uint32 _proposalId) external view returns (uint32[] memory, bool[] memory)",
            "function nextProposalId() external view returns (uint32)",
            "function nextReviewerId() external view returns (uint32)",
            "function admin() external view returns (address)",
            "event ProposalSubmitted(uint32 indexed proposalId, address indexed submitter, uint256 deadline)",
            "event ReviewerRegistered(uint32 indexed reviewerId, uint8 role)",
            "event ReviewAssigned(uint32 indexed proposalId, uint32 indexed reviewerId)",
            "event ReviewSubmitted(uint32 indexed proposalId, uint32 indexed reviewerId)",
            "event ProposalStatusUpdated(uint32 indexed proposalId, uint8 newStatus)",
            "event EthicsDecisionReached(uint32 indexed proposalId, uint8 finalDecision)"
        ];

        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.checkConnection();
        this.loadData();
    }

    setupEventListeners() {
        // Wallet connection
        document.getElementById('connectWallet').addEventListener('click', () => this.connectWallet());

        // Form submissions
        document.getElementById('submitProposal').addEventListener('click', () => this.submitProposal());
        document.getElementById('registerReviewer').addEventListener('click', () => this.registerReviewer());
        document.getElementById('submitReview').addEventListener('click', () => this.submitReview());
        document.getElementById('assignReviewers').addEventListener('click', () => this.assignReviewers());
    }

    async checkConnection() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await this.connectWallet();
                }
            } catch (error) {
                console.error('Error checking connection:', error);
            }
        }
    }

    async connectWallet() {
        try {
            if (typeof window.ethereum === 'undefined') {
                this.showError('Please install MetaMask to use this application');
                return;
            }

            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Initialize provider and signer
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            this.userAddress = await this.signer.getAddress();

            // Initialize contract
            this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.signer);

            // Update UI
            document.getElementById('connectWallet').style.display = 'none';
            document.getElementById('walletAddress').textContent = `Connected: ${this.userAddress.slice(0, 6)}...${this.userAddress.slice(-4)}`;
            document.getElementById('walletAddress').classList.remove('hidden');

            // Check network
            await this.checkNetwork();

            // Load data
            this.loadData();

            this.showSuccess('Wallet connected successfully');

        } catch (error) {
            console.error('Error connecting wallet:', error);
            this.showError('Failed to connect wallet: ' + error.message);
        }
    }

    async checkNetwork() {
        try {
            const network = await this.provider.getNetwork();
            const networkStatus = document.getElementById('networkStatus');

            if (network.chainId === 11155111) { // Sepolia
                networkStatus.textContent = '✓ Sepolia Testnet';
                networkStatus.style.color = '#00b894';
            } else {
                networkStatus.textContent = '⚠ Wrong Network - Please switch to Sepolia';
                networkStatus.style.color = '#e17055';
                this.showError('Please switch to Sepolia testnet');
            }
        } catch (error) {
            console.error('Error checking network:', error);
        }
    }

    async submitProposal() {
        try {
            if (!this.contract) {
                this.showError('Please connect your wallet first');
                return;
            }

            const riskLevel = parseInt(document.getElementById('riskLevel').value);
            const ethicsScore = parseInt(document.getElementById('ethicsScore').value);
            const reviewPeriod = parseInt(document.getElementById('reviewPeriod').value);

            if (!riskLevel || !ethicsScore || !reviewPeriod) {
                this.showError('Please fill in all fields');
                return;
            }

            if (riskLevel < 1 || riskLevel > 10) {
                this.showError('Risk level must be between 1 and 10');
                return;
            }

            if (ethicsScore < 1 || ethicsScore > 100) {
                this.showError('Ethics score must be between 1 and 100');
                return;
            }

            if (reviewPeriod < 7 || reviewPeriod > 90) {
                this.showError('Review period must be between 7 and 90 days');
                return;
            }

            this.showSuccess('Submitting proposal... Please confirm transaction');

            const tx = await this.contract.submitResearchProposal(riskLevel, ethicsScore, reviewPeriod);

            this.showSuccess('Transaction submitted. Waiting for confirmation...');
            await tx.wait();

            this.showSuccess('Research proposal submitted successfully!');

            // Clear form
            document.getElementById('riskLevel').value = '';
            document.getElementById('ethicsScore').value = '';
            document.getElementById('reviewPeriod').value = '';

            // Reload data
            this.loadData();

        } catch (error) {
            console.error('Error submitting proposal:', error);
            this.showError('Failed to submit proposal: ' + error.message);
        }
    }

    async registerReviewer() {
        try {
            if (!this.contract) {
                this.showError('Please connect your wallet first');
                return;
            }

            const experienceYears = parseInt(document.getElementById('experienceYears').value);
            const reviewerRole = parseInt(document.getElementById('reviewerRole').value);
            const qualificationScore = parseInt(document.getElementById('qualificationScore').value);

            if (!experienceYears || qualificationScore === undefined) {
                this.showError('Please fill in all fields');
                return;
            }

            if (experienceYears < 1 || experienceYears > 20) {
                this.showError('Experience must be between 1 and 20 years');
                return;
            }

            if (qualificationScore < 1 || qualificationScore > 1000) {
                this.showError('Qualification score must be between 1 and 1000');
                return;
            }

            this.showSuccess('Registering as reviewer... Please confirm transaction');

            const tx = await this.contract.registerAsReviewer(experienceYears, reviewerRole, qualificationScore);

            this.showSuccess('Transaction submitted. Waiting for confirmation...');
            await tx.wait();

            this.showSuccess('Reviewer registration successful!');

            // Clear form
            document.getElementById('experienceYears').value = '';
            document.getElementById('reviewerRole').value = '0';
            document.getElementById('qualificationScore').value = '';

            // Reload data
            this.loadData();

        } catch (error) {
            console.error('Error registering reviewer:', error);
            this.showError('Failed to register reviewer: ' + error.message);
        }
    }

    async submitReview() {
        try {
            if (!this.contract) {
                this.showError('Please connect your wallet first');
                return;
            }

            const proposalId = parseInt(document.getElementById('reviewProposalId').value);
            const reviewerId = parseInt(document.getElementById('reviewerId').value);
            const ethicsRating = parseInt(document.getElementById('ethicsRating').value);
            const riskAssessment = parseInt(document.getElementById('riskAssessment').value);
            const recommendation = parseInt(document.getElementById('recommendation').value);

            if (!proposalId || !reviewerId || !ethicsRating || !riskAssessment || !recommendation) {
                this.showError('Please fill in all fields');
                return;
            }

            if (ethicsRating < 1 || ethicsRating > 10) {
                this.showError('Ethics rating must be between 1 and 10');
                return;
            }

            if (riskAssessment < 1 || riskAssessment > 10) {
                this.showError('Risk assessment must be between 1 and 10');
                return;
            }

            this.showSuccess('Submitting review... Please confirm transaction');

            const tx = await this.contract.submitAnonymousReview(proposalId, reviewerId, ethicsRating, riskAssessment, recommendation);

            this.showSuccess('Transaction submitted. Waiting for confirmation...');
            await tx.wait();

            this.showSuccess('Review submitted successfully!');

            // Clear form
            document.getElementById('reviewProposalId').value = '';
            document.getElementById('reviewerId').value = '';
            document.getElementById('ethicsRating').value = '';
            document.getElementById('riskAssessment').value = '';
            document.getElementById('recommendation').value = '1';

            // Reload data
            this.loadData();

        } catch (error) {
            console.error('Error submitting review:', error);
            this.showError('Failed to submit review: ' + error.message);
        }
    }

    async assignReviewers() {
        try {
            if (!this.contract) {
                this.showError('Please connect your wallet first');
                return;
            }

            const proposalId = parseInt(document.getElementById('assignProposalId').value);
            const reviewerIdsInput = document.getElementById('reviewerIds').value;

            if (!proposalId || !reviewerIdsInput) {
                this.showError('Please fill in all fields');
                return;
            }

            const reviewerIds = reviewerIdsInput.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

            if (reviewerIds.length < 2 || reviewerIds.length > 5) {
                this.showError('Please assign between 2 and 5 reviewers');
                return;
            }

            this.showSuccess('Assigning reviewers... Please confirm transaction');

            const tx = await this.contract.assignReviewersToProposal(proposalId, reviewerIds);

            this.showSuccess('Transaction submitted. Waiting for confirmation...');
            await tx.wait();

            this.showSuccess('Reviewers assigned successfully!');

            // Clear form
            document.getElementById('assignProposalId').value = '';
            document.getElementById('reviewerIds').value = '';

            // Reload data
            this.loadData();

        } catch (error) {
            console.error('Error assigning reviewers:', error);
            this.showError('Failed to assign reviewers: ' + error.message);
        }
    }

    async loadData() {
        if (!this.contract) return;

        await Promise.all([
            this.loadProposals(),
            this.loadReviewers(),
            this.loadStats()
        ]);
    }

    async loadProposals() {
        try {
            const nextProposalId = await this.contract.nextProposalId();
            const proposalsList = document.getElementById('proposalsList');
            proposalsList.innerHTML = '';

            if (nextProposalId == 1) {
                proposalsList.innerHTML = '<p>No proposals submitted yet.</p>';
                return;
            }

            for (let i = 1; i < nextProposalId; i++) {
                try {
                    const proposalInfo = await this.contract.getProposalInfo(i);
                    const [status, submissionTime, reviewDeadline, assignedReviewers, completedReviews, submitter] = proposalInfo;

                    const proposalCard = this.createProposalCard(i, {
                        status,
                        submissionTime,
                        reviewDeadline,
                        assignedReviewers,
                        completedReviews,
                        submitter
                    });

                    proposalsList.appendChild(proposalCard);
                } catch (error) {
                    console.error(`Error loading proposal ${i}:`, error);
                }
            }

        } catch (error) {
            console.error('Error loading proposals:', error);
            document.getElementById('proposalsList').innerHTML = '<p>Error loading proposals.</p>';
        }
    }

    async loadReviewers() {
        try {
            const nextReviewerId = await this.contract.nextReviewerId();
            const reviewersList = document.getElementById('reviewersList');
            reviewersList.innerHTML = '';

            if (nextReviewerId == 1) {
                reviewersList.innerHTML = '<p>No reviewers registered yet.</p>';
                return;
            }

            for (let i = 1; i < nextReviewerId; i++) {
                try {
                    const reviewerInfo = await this.contract.getReviewerInfo(i);
                    const [role, isActive, isAvailable, totalReviews, registrationTime] = reviewerInfo;

                    const reviewerCard = this.createReviewerCard(i, {
                        role,
                        isActive,
                        isAvailable,
                        totalReviews,
                        registrationTime
                    });

                    reviewersList.appendChild(reviewerCard);
                } catch (error) {
                    console.error(`Error loading reviewer ${i}:`, error);
                }
            }

        } catch (error) {
            console.error('Error loading reviewers:', error);
            document.getElementById('reviewersList').innerHTML = '<p>Error loading reviewers.</p>';
        }
    }

    async loadStats() {
        try {
            const nextProposalId = await this.contract.nextProposalId();
            const nextReviewerId = await this.contract.nextReviewerId();

            document.getElementById('totalProposals').textContent = Math.max(0, nextProposalId - 1);
            document.getElementById('totalReviewers').textContent = Math.max(0, nextReviewerId - 1);

            // Count active reviews and completed reviews
            let activeReviews = 0;
            let completedReviews = 0;

            for (let i = 1; i < nextProposalId; i++) {
                try {
                    const proposalInfo = await this.contract.getProposalInfo(i);
                    const [status, , , assignedReviewers, completed] = proposalInfo;

                    if (status == 1) { // UnderReview
                        activeReviews++;
                    }
                    completedReviews += parseInt(completed);
                } catch (error) {
                    console.error(`Error loading proposal ${i} for stats:`, error);
                }
            }

            document.getElementById('activeReviews').textContent = activeReviews;
            document.getElementById('completedReviews').textContent = completedReviews;

        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    createProposalCard(id, data) {
        const card = document.createElement('div');
        card.className = 'item-card';

        const statusText = this.getStatusText(data.status);
        const statusClass = this.getStatusClass(data.status);

        card.innerHTML = `
            <div class="item-header">
                <div class="item-title">Proposal #${id}</div>
                <span class="status-indicator ${statusClass}">${statusText}</span>
            </div>
            <div class="item-details">
                <p><strong>Submitter:</strong> ${data.submitter.slice(0, 6)}...${data.submitter.slice(-4)}</p>
                <p><strong>Submitted:</strong> ${new Date(data.submissionTime * 1000).toLocaleDateString()}</p>
                <p><strong>Deadline:</strong> ${new Date(data.reviewDeadline * 1000).toLocaleDateString()}</p>
                <p><strong>Progress:</strong> ${data.completedReviews}/${data.assignedReviewers} reviews completed</p>
            </div>
        `;

        return card;
    }

    createReviewerCard(id, data) {
        const card = document.createElement('div');
        card.className = 'item-card';

        const roleText = this.getRoleText(data.role);
        const roleClass = this.getRoleClass(data.role);

        card.innerHTML = `
            <div class="item-header">
                <div class="item-title">Reviewer #${id}</div>
                <span class="role-badge ${roleClass}">${roleText}</span>
            </div>
            <div class="item-details">
                <p><strong>Status:</strong> ${data.isActive ? (data.isAvailable ? 'Available' : 'Busy') : 'Inactive'}</p>
                <p><strong>Total Reviews:</strong> ${data.totalReviews}</p>
                <p><strong>Registered:</strong> ${new Date(data.registrationTime * 1000).toLocaleDateString()}</p>
            </div>
        `;

        return card;
    }

    getStatusText(status) {
        const statuses = ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Requires Revision'];
        return statuses[status] || 'Unknown';
    }

    getStatusClass(status) {
        const classes = ['status-submitted', 'status-under-review', 'status-approved', 'status-rejected', 'status-requires-revision'];
        return classes[status] || '';
    }

    getRoleText(role) {
        const roles = ['Junior', 'Senior', 'Expert'];
        return roles[role] || 'Unknown';
    }

    getRoleClass(role) {
        const classes = ['role-junior', 'role-senior', 'role-expert'];
        return classes[role] || '';
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');

        successDiv.classList.add('hidden');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');

        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }

    showSuccess(message) {
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');

        errorDiv.classList.add('hidden');
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');

        setTimeout(() => {
            successDiv.classList.add('hidden');
        }, 5000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check if ethers is loaded
    if (typeof ethers === 'undefined') {
        console.error('Ethers.js not loaded');
        document.getElementById('errorMessage').textContent = 'Failed to load Web3 library. Please refresh the page.';
        document.getElementById('errorMessage').classList.remove('hidden');
        return;
    }

    console.log('Ethers.js loaded:', ethers.version);
    new EthicsReviewApp();
});