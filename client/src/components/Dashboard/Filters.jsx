import React, { useState, useEffect } from 'react';
import { fetchParishesByArchdeaconry, fetchCongregationsByParish,fetchArchdeaconries,fetchCongregationsByArchdeaconry } from '../../services/api';
import { toast } from 'react-toastify';
import './Filters.css';

const Filters = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [archdeaconries, setArchdeaconries] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [congregations, setCongregations] = useState([]);
  const [loading, setLoading] = useState({
    archdeaconries: true,
    parishes: false,
    congregations: false
  });

  // Load all archdeaconries initially
  useEffect(() => {
    const loadArchdeaconries = async () => {
      try {
        const response = await fetchArchdeaconries();
        setArchdeaconries(response.data);
      } catch (error) {
        toast.error('Failed to load archdeaconries');
      } finally {
        setLoading(prev => ({ ...prev, archdeaconries: false }));
      }
    };
    loadArchdeaconries();
  }, []);

  // When archdeaconry changes, load its parishes and congregations
  useEffect(() => {
    const loadParishesAndCongregations = async () => {
      if (!filters.archdeaconry) {
        setParishes([]);
        setCongregations([]);
        return;
      }

      try {
        setLoading(prev => ({ ...prev, parishes: true, congregations: true }));

        // Fetch parishes in this archdeaconry
        const parishesResponse = await fetchParishesByArchdeaconry(filters.archdeaconry);
        setParishes(parishesResponse.data);

        // Fetch congregations in this archdeaconry
        if (parishesResponse.data.length > 0) {
          const parishIds = parishesResponse.data.map(p => p.id);
          const congregationsResponse = await fetchCongregationsByArchdeaconry(parishIds);
          setCongregations(congregationsResponse.data);
        } else {
          setCongregations([]);
        }
      } catch (error) {
        toast.error('Failed to load parishes and congregations');
      } finally {
        setLoading(prev => ({ ...prev, parishes: false, congregations: false }));
      }
    };

    loadParishesAndCongregations();
  }, [filters.archdeaconry]);

  // When parish changes, update congregations for that parish
  useEffect(() => {
    const loadCongregations = async () => {
      if (!filters.parish) return;

      try {
        setLoading(prev => ({ ...prev, congregations: true }));
        const response = await fetchCongregationsByParish(filters.parish);
        setCongregations(response.data);
      } catch (error) {
        toast.error('Failed to load congregations');
      } finally {
        setLoading(prev => ({ ...prev, congregations: false }));
      }
    };

    loadCongregations();
  }, [filters.parish]);

  // Notify parent when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleArchdeaconryChange = (e) => {
    const archdeaconryId = e.target.value;
    setFilters({
      archdeaconry: archdeaconryId,
      parish: '',
      congregation: '',
      start_date: filters.start_date,
      end_date: filters.end_date
    });
  };

  const handleParishChange = (e) => {
    const parishId = e.target.value;
    setFilters({
      ...filters,
      parish: parishId,
      congregation: ''
    });
  };

  const handleCongregationChange = (e) => {
    setFilters({
      ...filters,
      congregation: e.target.value
    });
  };

  const handleDateChange = (name, date) => {
    setFilters({
      ...filters,
      [name]: date
    });
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label htmlFor="archdeaconry">Archdeaconry:</label>
        <select
          id="archdeaconry"
          name="archdeaconry"
          value={filters.archdeaconry || ''}
          onChange={handleArchdeaconryChange}
          disabled={loading.archdeaconries}
        >
          <option value="">All Archdeaconries</option>
          {archdeaconries.map(arch => (
            <option key={arch.id} value={arch.id}>{arch.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="parish">Parish:</label>
        <select
          id="parish"
          name="parish"
          value={filters.parish || ''}
          onChange={handleParishChange}
          disabled={loading.parishes || !filters.archdeaconry}
        >
          <option value="">All Parishes</option>
          {parishes.map(parish => (
            <option key={parish.id} value={parish.id}>{parish.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="congregation">Congregation:</label>
        <select
          id="congregation"
          name="congregation"
          value={filters.congregation || ''}
          onChange={handleCongregationChange}
          disabled={loading.congregations || (!filters.parish && !filters.archdeaconry)}
        >
          <option value="">All Congregations</option>
          {congregations.map(cong => (
            <option key={cong.id} value={cong.id}>{cong.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Date Range:</label>
        <div className="date-range">
          <input
            type="date"
            value={filters.start_date || ''}
            onChange={(e) => handleDateChange('start_date', e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            value={filters.end_date || ''}
            onChange={(e) => handleDateChange('end_date', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
