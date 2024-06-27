# Entities

* Status: proposed
* Date: 2024-06-05

## Context and Problem Statement

We need a way to represent anything that is capable of "independently" making changes to system state, or generally being responsible any aspect of it.

## Considered Options

* "Person" type only
* "Person," "group" and "machine" types
* Single "entity" type

## Decision Outcome

Chosen option: "Single "entity" type", because it requires the least amount of database work
