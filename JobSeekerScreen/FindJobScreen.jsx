import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Button, TextInput, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';

const FindJobScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expFilter, setExpFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [jobModeFilter, setJobModeFilter] = useState('');

  const expYeardata = ['', 'Fresher', "0 - 1 year", "2-5 Years", "More than 5 Years", "More than 10 Years"];
  const JobTypedata = ['', 'Full Time', "Part Time", "Internship"];
  const JobModedata = ['', 'Hybrid', "Remote", "Offline"];

  const fetchJobs = async () => {
    try {
      const q = collection(db, 'jobs');
      const querysnap = await getDocs(q);
      let fetchedJobs = [];
      querysnap.forEach((doc) => {
        fetchedJobs.push({ id: doc.id, ...doc.data() });
      });
      setJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleQueryChange = (value) => {
    setSearchQuery(value);

    if (value === '') {
      setFilteredJobs(jobs);
    } else {
      const searchFilter = jobs.filter((job) => 
        job.jobrole.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredJobs(searchFilter);
    }
  };

  const handleApplyFilters = () => {
    let updatedJobs = jobs.filter(job =>
      job.jobrole.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (expFilter) {
      updatedJobs = updatedJobs.filter((job) => job.expYear === expFilter);
    }
    if (jobTypeFilter) {
      updatedJobs = updatedJobs.filter((job) => job.jobType === jobTypeFilter);
    }
    if (jobModeFilter) {
      updatedJobs = updatedJobs.filter((job) => job.jobMode === jobModeFilter);
    }

    setFilteredJobs(updatedJobs);
    setShowFilters(false);
  };

  return (
    <View>
      <Text>Find Job Screen</Text>

      <TextInput
        placeholder="Search Jobs..."
        value={searchQuery}
        onChangeText={(val) => handleQueryChange(val)}
        style={{borderWidth: 1, margin: 10, padding: 8}}
      />

      <Pressable onPress={() => setShowFilters(!showFilters)}>
        <Text style={{color: 'blue', marginBottom: 10}}>Show Filters</Text>
      </Pressable>

      {filteredJobs.map((job) => (
        <View key={job.id} style={{marginVertical: 5}}>
          <Text>{job.jobrole}</Text>
        </View>
      ))}

      {showFilters && (
        <View style={{backgroundColor: "lightblue", height: "100%", width: "50%", position: "absolute", right: 0, padding: 10}}>
          <Text style={{fontWeight: 'bold'}}>Filters</Text>

          <View>
            <Text style={{marginTop: 10}}>Experience</Text>
            {expYeardata.map((exp, index) => (
              <TouchableOpacity key={index} onPress={() => setExpFilter(exp)}>
                <Text style={{padding: 5}}>{exp}</Text>
              </TouchableOpacity>
            ))}

            <Text style={{marginTop: 10}}>Job Type</Text>
            {JobTypedata.map((type, index) => (
              <TouchableOpacity key={index} onPress={() => setJobTypeFilter(type)}>
                <Text style={{padding: 5}}>{type}</Text>
              </TouchableOpacity>
            ))}

            <Text style={{marginTop: 10}}>Job Mode</Text>
            {JobModedata.map((mode, index) => (
              <TouchableOpacity key={index} onPress={() => setJobModeFilter(mode)}>
                <Text style={{padding: 5}}>{mode}</Text>
              </TouchableOpacity>
            ))}

            <Button title="Apply Filters" onPress={handleApplyFilters} />
          </View>
        </View>
      )}
    </View>
  );
};

export default FindJobScreen;
