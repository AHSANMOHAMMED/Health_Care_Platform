package com.mediconnect.authservice.service;

import com.mediconnect.authservice.entity.UserCredentials;
import com.mediconnect.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserCredentials> credential = repository.findByEmail(username);
        return credential.map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("user not found with name :" + username));
    }
}
