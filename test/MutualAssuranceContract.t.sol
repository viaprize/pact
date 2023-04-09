// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import { Test } from "forge-std/Test.sol";
import { GnosisSafeProxyFactory } from "safe-contracts/proxies/GnosisSafeProxyFactory.sol";
import { GnosisSafe } from "safe-contracts/GnosisSafe.sol";
import { PactFactory } from "../src/PactFactory.sol";
import { Pact } from "../src/Pact.sol";

/// @notice Test the mutual assurance contract
contract MutualAssuranceContractTest is Test {
    event Assurance(address who, uint256 value);
    event Resolve(bool);

    // both accounts are from mainnet
    GnosisSafeProxyFactory constant safeFactory = GnosisSafeProxyFactory(0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2);
    GnosisSafe constant safeSingleton = GnosisSafe(payable(0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552));

    address internal alice;
    address internal bob;
    address internal charlie;

    PactFactory internal factory;

    /// @notice Set up the test env
    function setUp() external {
        factory = new PactFactory({
            _safeFactory: safeFactory,
            _safeSingleton: safeSingleton
        });

        vm.label(address(safeFactory), "GnosisSafeProxyFactory");
        vm.label(address(safeSingleton), "GnosisSafe");

        alice = makeAddr("alice");
        bob = makeAddr("bob");
        charlie = makeAddr("charlie");

        deal(alice, 100 ether);
        deal(bob, 100 ether);
        deal(charlie, 100 ether);

        _setupSafe();
    }

    /// @notice Sets the GnosisSafe related code at the correct addresses.
    function _setupSafe() internal skipWhenForking {
        vm.etch(address(safeFactory), vm.getDeployedCode("GnosisSafeProxyFactory.sol"));
        vm.etch(address(safeSingleton), vm.getDeployedCode("GnosisSafe.sol"));
    }

    /// @notice Deploys a standard MutualAssuranceContract for testing. Alice and Bob
    ///         are guardians and Charlie is not.
    function _deploy() internal returns (Pact) {
        address[] memory _guardians = new address[](2);
        _guardians[0] = alice;
        _guardians[1] = bob;
        string memory agreement = "i like turtles";

        return _deploy(_guardians, agreement);
    }

    /// @notice Deploy a Pact with configurable guardians.
    function _deploy(address[] memory _guardians, string memory _agreement) internal returns (Pact) {
        bytes32 commitment = factory.commit(_agreement);

        Pact pact = factory.create({
            _commitment: commitment,
            _duration: 12 * 500,
            _lump: 1 ether,
            _guardians: _guardians
        });

        vm.label(address(pact), "pact");
        return pact;
    }

    /// @notice Refactor into a builder pattern if we need more configurable
    ///         pacts.
    function _deploy(string memory _agreement) internal returns (Pact) {
        address[] memory guardians = new address[](2);
        guardians[0] = alice;
        guardians[1] = bob;

        return _deploy(guardians, _agreement);
    }

    function _deploy(address[] memory _guardians) internal returns (Pact) {
        string memory agreement = "i like turtles";
        return _deploy(_guardians, agreement);
    }

    /// @notice Ensures that the constructor initializes the factory correctly
    function test_factory_constructor() external {
        address _safeFactory = address(factory.safeFactory());
        assertEq(_safeFactory, address(safeFactory));
        assertTrue(_safeFactory.code.length > 0);

        address _safeSingleton = address(factory.safeSingleton());
        assertEq(_safeSingleton, address(safeSingleton));
        assertTrue(_safeSingleton.code.length > 0);

        address implementation = address(factory.implementation());
        assertTrue(implementation != address(0));
        assertTrue(implementation.code.length != 0);
    }

    /// @notice Ensures that a factory can be created with sane config
    function test_factory_create() external {
        address[] memory _guardians = new address[](1);
        _guardians[0] = alice;

        bytes32 commitment = keccak256(abi.encode(block.timestamp));
        uint256 duration = 1e6;
        uint256 lump = 30 ether;

        Pact pact = factory.create({
            _commitment: commitment,
            _duration: duration,
            _lump: lump,
            _guardians: _guardians
        });

        vm.label(address(pact), "pact");

        assertEq(address(pact.safeFactory()), address(safeFactory));
        assertEq(address(pact.safeSingleton()), address(safeSingleton));

        assertEq(pact.resolved(), false);
        assertEq(pact.start(), block.timestamp);

        assertEq(pact.duration(), duration);
        assertEq(pact.lump(), lump);
        assertEq(pact.commitment(), commitment);
        assertEq(pact.guardians(), _guardians);
        assertEq(address(pact.safe()), address(0));
    }

    /// @notice Creation reverts when no value is configured to be able to win.
    function test_factory_createNoLumpReverts() external {
        address[] memory _guardians = new address[](1);
        _guardians[0] = alice;

        vm.expectRevert(abi.encodeWithSelector(PactFactory.Empty.selector));
        factory.create({
            _commitment: bytes32(uint256(1)),
            _duration: 0,
            _lump: 0,
            _guardians: _guardians
        });
    }

    /// @notice Creation reverts when no guardians are configured.
    function test_factory_createNoGuardiansReverts() external {
        address[] memory _guardians = new address[](0);

        vm.expectRevert(abi.encodeWithSelector(PactFactory.Empty.selector));
        factory.create({
            _commitment: bytes32(uint256(1)),
            _duration: 0,
            _lump: 1 ether,
            _guardians: _guardians
        });
    }

    /// @notice Any user can contribute.
    function test_pact_contribute() external {
        Pact pact = _deploy();

        uint256 value = 1 ether;

        vm.expectEmit(true, true, true, true, address(pact));
        emit Assurance(alice, value);

        vm.prank(alice);
        (bool success, ) = address(pact).call{ value: value }(hex"");
        assertTrue(success);

        assertEq(address(pact).balance, value);

        Pact.Contribution[] memory contribs = pact.contributions();
        assertEq(contribs.length, 1);

        Pact.Contribution memory contrib = contribs[0];
        assertEq(contrib.from, alice);
        assertEq(contrib.amount, value);

        Pact.Contribution memory contribution = pact.contribution(0);
        assertEq(contribution.from, alice);
        assertEq(contribution.amount, value);
    }

    /// @notice The commitment feature works as expected.
    function test_pact_commit() external {
        string memory commitment = "I solemnly swear that I am up to no good";
        Pact pact = _deploy(commitment);
        assertEq(factory.commit(commitment), pact.commitment());
    }

    /// @notice Ensures that all the side effects of winning a pact are correct.
    function test_pact_win() external {
        address[] memory guardians = new address[](1);
        guardians[0] = alice;

        Pact pact = _deploy(guardians);

        // Add enough value
        uint256 value = pact.lump();

        vm.expectEmit(true, true, true, true, address(pact));
        emit Assurance(alice, value);

        vm.prank(alice);
        (bool success, ) = address(pact).call{ value: value }(hex"");
        assertTrue(success);
        // The pact should have enough value
        assertEq(address(pact).balance, value);

        // Move time to the end
        uint256 end = pact.end();
        vm.warp(end);

        // It should be resolvable and continuing
        assertTrue(pact.resolvable());
        assertTrue(pact.continuing());

        vm.expectEmit(true, true, true, true, address(pact));
        emit Resolve(true);

        vm.prank(bob);
        pact.resolve();

        assertTrue(pact.resolved());

        assertEq(address(pact).balance, 0);

        GnosisSafe safe = pact.safe();
        assertTrue(address(safe).code.length > 0);

        address[] memory owners = safe.getOwners();
        assertEq(guardians, owners);
        assertEq(safe.getThreshold(), owners.length);
        assertEq(address(safe).balance, value);
    }

    /// @notice Test a failed resolution
    function test_pact_lose() external {
        address[] memory guardians = new address[](1);
        guardians[0] = alice;

        Pact pact = _deploy(guardians);

        uint256 alicePreBalance = alice.balance;

        uint256 value = pact.lump() - 1;

        vm.expectEmit(true, true, true, true, address(pact));
        emit Assurance(alice, value);

        vm.prank(alice);
        (bool success, ) = address(pact).call{ value: value }(hex"");
        assertTrue(success);

        uint256 end = pact.end();
        vm.warp(end);

        assertTrue(pact.resolvable());
        assertFalse(pact.continuing());

        vm.expectEmit(true, true, true, true, address(pact));
        emit Resolve(false);

        vm.expectCall(alice, value, hex"");

        vm.prank(bob);
        pact.resolve();

        uint256 alicePostBalance = alice.balance;
        assertEq(alicePostBalance, alicePreBalance);
    }
}
