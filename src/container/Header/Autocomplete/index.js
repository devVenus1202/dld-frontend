import React from 'react';
import AutoSuggest from 'react-autosuggest';

let timing;
export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: []
    };
  }

  componentDidMount() {
    const {searchValue} = this.props;
    this.setState({
      value: searchValue
    });
  }

  makeFilterId = (section) => {
    return `f${section.filterId}_${section.filterUniqueId}`;
  };

  getSuggestionValue(suggestion) {
    return suggestion.filterValue;
  }

  renderSuggestion = (suggestion) => {
    const {onClick} = this.props;

    return (
      <span>{suggestion.categoryName}</span>
    );

  };


  renderSectionTitle = (section) => {
    const {onClick, all_categories_template_id} = this.props;
    return (
      <strong onClick={() => {

        this.setState({
          value: section.filterValue
        });

        const filters = this.makeFilterId(section);

        onClick({
          filters,
          last_filter: filters,
          search: section.filterValue
        });
      }}>{section.filterValue} <span>in {section.categoryName || all_categories_template_id}</span></strong>
    );
  };

  getSectionSuggestions(section) {
    return section.categories || [];
  }

  onChange = (event, data) => {
    const {newValue, method} = data;
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = (data) => {
    const {value} = data;
    const {onChange} = this.props;
    clearTimeout(timing);
    timing = setTimeout(() => {
      onChange(value);
    }, 300);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionsSelected = (event, {suggestion}) => {
    const {onClick} = this.props;

    const filters = this.makeFilterId(suggestion);

    onClick({
      filters,
      last_filter: filters,
      categories: suggestion.categoryId
    });
  };

  getSuggestions = () => {
    const {suggestions} = this.props.suggestions;

    return suggestions;

  };

  shouldRenderSuggestions = (value) => {
    return true;
  };

  render() {
    const {value} = this.state;
    const {onFocus, onBlur, placeholder} = this.props;

    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange,
      onFocus,
      onBlur
    };

    // Finally, render it!
    return (
      <div className="input-group input-search-form-height">
        <AutoSuggest
          className="form-control search-control"
          multiSection={true}
          suggestions={this.getSuggestions()}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionsSelected}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          renderSectionTitle={this.renderSectionTitle}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          getSectionSuggestions={this.getSectionSuggestions}
          alwaysRenderSuggestions={true}

          inputProps={inputProps}
          theme={{
            container: 'input-group input-search-form-height',
            input: 'form-control search-control',
            inputOpen: 'form-control search-active',
            inputFocused: 'form-control search-active',
            suggestionsContainer: 'autocomplete-suggestions-container',
            suggestionsContainerOpen: 'suggestionsContainerOpen',
            suggestionsList: 'suggestionsList',
            suggestion: 'suggestion',
            suggestionFirst: 'suggestionFirst',
            suggestionHighlighted: 'suggestionHighlighted',
            sectionContainer: 'sectionContainer',
            sectionContainerFirst: 'sectionContainerFirst',
            sectionTitle: 'sectionTitle'
          }}
        />
      </div>
    );
  }
}