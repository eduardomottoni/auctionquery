import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { useDispatch, useSelector } from '@/store';
import { setFilters, setSort, setLastSearch } from '@/store/searchSlice';
import { toggleShowOnlyFavorites, selectShowOnlyFavorites } from '@/store/vehiclesSlice';
import { RootState } from '@/store';
import Button from '@/components/ui/Button';
import { media } from '@/styles/theme';

const ControlsWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StyledForm = styled(Form)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;

  ${media.down('sm')} { // Target small screens
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); // Allow slightly smaller columns
  }

  ${media.down('xs')} { // Target extra-small screens (adjust breakpoint if needed)
      grid-template-columns: 1fr; // Stack everything into one column
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Input = styled(Field)`
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;

  &::placeholder {
      color: ${({ theme }) => theme.colors.secondary};
      opacity: 0.6;
  }
`;

const Select = styled(Field)`
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ButtonGroup = styled.div`
    grid-column: 1 / -1; 
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.md};

    ${media.down('xs')} { // Stack buttons on extra-small screens
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
    }
`;

const CheckboxContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  user-select: none;
`;

const StyledCheckbox = styled.input`
  margin-right: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
`;

// Validation Schema
const FilterSchema = Yup.object().shape({
  make: Yup.string(),
  model: Yup.string(),
  minBid: Yup.number().typeError('Must be a number').min(0, 'Cannot be negative'),
  maxBid: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative')
    .when('minBid', (minBid, schema) => {
        // Ensure maxBid is >= minBid if minBid is provided
        return (minBid && typeof minBid === 'number')
            ? schema.min(minBid, 'Max bid must be >= min bid')
            : schema;
    }),
});

const sortOptions = [
    { value: '', label: 'Default Order' },
    { value: 'make_asc', label: 'Make (A-Z)' },
    { value: 'make_desc', label: 'Make (Z-A)' },
    { value: 'startingBid_asc', label: 'Bid (Low-High)' },
    { value: 'startingBid_desc', label: 'Bid (High-Low)' },
    { value: 'mileage_asc', label: 'Mileage (Low-High)' },
    { value: 'mileage_desc', label: 'Mileage (High-Low)' },
    { value: 'auctionDateTime_asc', label: 'Auction Date (Earliest)' },
    { value: 'auctionDateTime_desc', label: 'Auction Date (Latest)' },
];

const FilterSortControls: React.FC = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector((state: RootState) => state.search.filters);
  const currentSort = useSelector((state: RootState) => state.search.sort);
  const showOnlyFavorites = useSelector(selectShowOnlyFavorites);

  // Combine field and direction into a single value for the select input
  const currentSortValue = currentSort ? `${currentSort.field}_${currentSort.direction}` : '';

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === '') {
      dispatch(setSort(null));
    } else {
      const [field, direction] = value.split('_');
      dispatch(setSort({ field, direction: direction as 'asc' | 'desc' }));
    }
    // Save the search state whenever sort changes
    dispatch(setLastSearch());
  };

  const handleFavoritesToggle = () => {
    dispatch(toggleShowOnlyFavorites());
  };

  return (
    <ControlsWrapper>
      <Formik
        initialValues={{
          make: currentFilters.make || '',
          model: currentFilters.model || '',
          // Assume bid filter is stored as { min: number, max: number }
          minBid: currentFilters.startingBid?.min || '',
          maxBid: currentFilters.startingBid?.max || '',
        }}
        validationSchema={FilterSchema}
        onSubmit={(values, { setSubmitting }) => {
          const newFilters: { [key: string]: any } = {};
          if (values.make) newFilters.make = values.make;
          if (values.model) newFilters.model = values.model;

          const minBid = values.minBid !== '' ? Number(values.minBid) : undefined;
          const maxBid = values.maxBid !== '' ? Number(values.maxBid) : undefined;
          if (minBid !== undefined || maxBid !== undefined) {
            newFilters.startingBid = { min: minBid, max: maxBid };
          }

          dispatch(setFilters(newFilters));
          // Save the search state when filters are applied
          dispatch(setLastSearch());

          setSubmitting(false);
        }}
        enableReinitialize // Re-initialize form if Redux state changes externally
      >
        {({ isSubmitting }) => (
          <StyledForm>
            <FormGroup>
              <Label htmlFor="make">Make</Label>
              <Input id="make" name="make" placeholder="e.g., Ford" />
              <ErrorMessage name="make" component={ErrorText} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" placeholder="e.g., Mustang" />
              <ErrorMessage name="model" component={ErrorText} />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="minBid">Min Bid ($)</Label>
              <Input id="minBid" name="minBid" type="number" placeholder="Min" />
              <ErrorMessage name="minBid" component={ErrorText} />
            </FormGroup>

             <FormGroup>
              <Label htmlFor="maxBid">Max Bid ($)</Label>
              <Input id="maxBid" name="maxBid" type="number" placeholder="Max" />
              <ErrorMessage name="maxBid" component={ErrorText} />
            </FormGroup>

            <FormGroup>
                <Label htmlFor="sortControl">Sort By</Label>
                {/* eslint-disable-next-line jsx-a11y/no-onchange -- Linter cannot link label correctly */}
                <Select
                    id="sortControl"
                    name="sort"
                    as="select"
                    value={currentSortValue}
                    onChange={handleSortChange}
                    aria-label="Sort vehicles by"
                >
                    {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>
            </FormGroup>

            <CheckboxContainer>
              <CheckboxLabel htmlFor="showFavoritesOnly">
                <StyledCheckbox
                  type="checkbox"
                  id="showFavoritesOnly"
                  checked={showOnlyFavorites}
                  onChange={handleFavoritesToggle}
                />
                Show only favorites
              </CheckboxLabel>
            </CheckboxContainer>

            <ButtonGroup>
                {/* Reset button could potentially clear filters/sort and lastSearch in Redux */}
                {/* <Button type="button" variant="outline" onClick={handleReset}>Reset</Button> */}
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    Apply Filters
                </Button>
            </ButtonGroup>
          </StyledForm>
        )}
      </Formik>
    </ControlsWrapper>
  );
};

export default FilterSortControls; 