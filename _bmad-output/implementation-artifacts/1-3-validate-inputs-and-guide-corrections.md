# Story 1.3: Validate Inputs and Guide Corrections

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an end user,
I want clear validation and guidance for missing or unclear inputs,
so that I know what to fix before requesting recommendations.

## Acceptance Criteria

1. Given I attempt to submit incomplete or unclear recommendation inputs, when validation runs, then the system blocks recommendation generation, and it shows specific status messaging that identifies what is missing or needs refinement.
2. Given validation errors are present, when I correct the affected fields, then the errors are cleared without resetting the rest of my entered context, and the form becomes submittable once sufficient input is provided.

## Tasks / Subtasks

- [ ] Add validation logic to context input form to check for missing or unclear inputs
- [ ] Implement status messaging system to display specific validation errors
- [ ] Add form state management to preserve valid inputs while clearing only invalid fields
- [ ] Create validation rules for occasion, weather context, and style preference fields
- [ ] Add accessibility-compliant error messages and ARIA attributes
- [ ] Implement form submission blocking when validation errors are present
- [ ] Add unit tests for validation logic and error handling
- [ ] Add integration tests for form state preservation during validation

## Dev Notes

### Technical Requirements

- Add client-side validation logic to the context input form in `apps/web/src/features/recommendation-flow/context-input-form.tsx`
- Implement validation rules for three required fields: occasion, weather context, and style preference
- Create a status messaging system that displays specific error messages for each validation failure
- Preserve valid user inputs when clearing only invalid fields during validation
- Block form submission when validation errors are present
- Ensure validation feedback is immediate and user-friendly
- Maintain session state preservation behavior established in Story 1.2

### Architecture Compliance

- Follow the frontend architecture established in Story 1.1 and 1.2:
  - Keep validation logic within the `recommendation-flow` feature folder
  - Use local component state for validation state management
  - Do not introduce global state management for this validation story
  - Maintain the App Router structure with client components for interactive elements
  - Keep business logic out of route handlers (`src/app/page.tsx`)
- Validation should be purely client-side for this story - no backend API calls required
- Follow the naming conventions: component files in `kebab-case`, React components in `PascalCase`
- Use the existing Tailwind CSS styling approach for error states and messaging
- Maintain the feature-first organization: validation logic belongs in `src/features/recommendation-flow/`

### Library / Framework Requirements

- Use the existing Next.js `16.x` and React `19.x` stack already established
- Leverage the existing Vitest + Testing Library test setup from Story 1.2
- Use standard HTML form validation attributes where appropriate
- Implement ARIA attributes for accessibility compliance
- Use the existing Tailwind CSS for styling validation states
- No new dependencies should be introduced unless absolutely critical for validation functionality

### File Structure Requirements

- Modify existing files in `apps/web/src/features/recommendation-flow/`:
  - `context-input-form.tsx` - add validation logic and error state management
  - `recommendation-flow.tsx` - may need to pass validation state if needed
  - `recommendation-flow.test.tsx` - add validation test coverage
- Create new files if needed:
  - `validation.ts` - validation utility functions (if logic becomes complex)
  - `types.ts` - validation-related TypeScript types
- Do not modify files outside the recommendation-flow feature unless absolutely necessary
- Keep validation logic contained within the feature boundary

### Testing Requirements

- Add unit tests for validation logic covering:
  - Required field validation for all three inputs
  - Error message generation for each validation failure
  - Form state preservation during validation
  - Submission blocking when errors are present
- Add integration tests for:
  - User interaction with validation feedback
  - Error clearing when fields are corrected
  - Session state preservation during validation cycles
- Maintain the existing test structure and patterns from Story 1.2
- Ensure tests are accessible and cover both success and error scenarios
- Use the existing Vitest configuration and Testing Library utilities

### Project Structure Notes

- This story builds directly on Story 1.2's context input form implementation
- The form already exists and captures occasion, weather context, and style preference
- Session state preservation is already implemented using `sessionStorage`
- The form currently has a disabled "Next" button that should remain disabled until validation passes
- Validation should integrate seamlessly with the existing form structure
- Error messages should be displayed near the relevant form fields
- The validation system should not interfere with the responsive layout established in Story 1.2

### References

- [_bmad-output/planning-artifacts/epics.md](/Users/mac2014l/Desktop/pocs-projects/bmad-poc/_bmad-output/planning-artifacts/epics.md) - Story 1.3 definition and acceptance criteria
- [_bmad-output/planning-artifacts/architecture.md](/Users/mac2014l/Desktop/pocs-projects/bmad-poc/_bmad-output/planning-artifacts/architecture.md) - frontend architecture, state management, and naming conventions
- [_bmad-output/implementation-artifacts/1-2-build-the-context-input-form.md](/Users/mac2014l/Desktop/pocs-projects/bmad-poc/_bmad-output/implementation-artifacts/1-2-build-the-context-input-form.md) - previous story implementation details and patterns
- [context-input-form.tsx](/Users/mac2014l/Desktop/pocs-projects/bmad-poc/apps/web/src/features/recommendation-flow/context-input-form.tsx) - existing form implementation to extend
- [recommendation-flow.test.tsx](/Users/mac2014l/Desktop/pocs-projects/bmad-poc/apps/web/src/features/recommendation-flow/recommendation-flow.test.tsx) - existing test structure to extend

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created
- Analyzed Story 1.2 implementation patterns for validation integration points
- Extracted architecture requirements for frontend validation patterns
- Identified existing form structure and session state preservation mechanisms
- Mapped validation requirements to existing component structure
- Established testing patterns based on Story 1.2 test infrastructure

### File List

- _bmad-output/implementation-artifacts/1-3-validate-inputs-and-guide-corrections.md (this file)
- apps/web/src/features/recommendation-flow/context-input-form.tsx (to be modified)
- apps/web/src/features/recommendation-flow/recommendation-flow.test.tsx (to be extended)
- apps/web/src/features/recommendation-flow/types.ts (may need validation types)

### Change Log

- 2026-03-12: Created comprehensive story context with validation requirements, architecture compliance, and testing strategy
- 2026-03-12: Integrated previous story learnings and established clear implementation boundaries

## Senior Developer Review (AI)

- Outcome: Ready for implementation
- Date: 2026-03-12
- [x] Validation requirements clearly defined and scoped to client-side implementation
- [x] Architecture compliance maintained with existing frontend patterns
- [x] Testing strategy established based on existing test infrastructure
- [x] Clear file structure and modification boundaries defined
- [x] Integration points with Story 1.2 implementation identified
