/*******************************************************************************
 * Copyright 2015-2018 Capgemini SE.
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ******************************************************************************/
package com.devonfw.module.winauthad.common.api.security;

import java.security.Principal;
import java.util.Collection;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import com.devonfw.module.winauthad.common.api.PrincipalProfile;
import com.devonfw.module.winauthad.common.api.to.UserDetailsClientToAD;

/**
 * Container class for the profile of a user.
 *
 * @author hohwille, jhcore
 */
public class UserDataAD extends User implements Principal {

  private static final long serialVersionUID = 1L;

  private PrincipalProfile userProfile;

  /**
   * The constructor.
   *
   * @param username sets the username
   * @param password sets the password
   * @param enabled check if user is enabled
   * @param accountNonExpired check if user account is not expired
   * @param credentialsNonExpired check if user credentials are not expired
   * @param accountNonLocked check if user account is not locked
   * @param authorities the authorities/permissions the user has
   */
  public UserDataAD(String username, String password, boolean enabled, boolean accountNonExpired,
      boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {

    super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
  }

  /**
   * The constructor.
   *
   * @param username sets the username
   * @param password sets the password
   * @param authorities the authorities/permissions the user has
   */
  public UserDataAD(String username, String password, Collection<? extends GrantedAuthority> authorities) {

    super(username, password, authorities);
  }

  @Override
  public String getName() {

    return getUsername();
  }

  /**
   * @return an instance of {@link UserDetailsClientToAD} with the client side representation of this {@link UserDataAD}
   *         instance.
   */
  public UserDetailsClientToAD toClientTo() {

    UserDetailsClientToAD clientTo = new UserDetailsClientToAD();
    clientTo.setId(this.userProfile.getId());
    clientTo.setName(this.userProfile.getName());
    clientTo.setFirstName(this.userProfile.getFirstName());
    clientTo.setLastName(this.userProfile.getLastName());
    clientTo.setGroups(this.userProfile.getGroups());
    return clientTo;
  }

  @Override
  public String toString() {

    return getName();
  }

  /**
   * @return userProfile
   */
  public PrincipalProfile getUserProfile() {

    return this.userProfile;
  }

  /**
   * @param userProfile the userProfile com.devonfw.module.winauth.common.api.to set
   */
  public void setUserProfile(PrincipalProfile userProfile) {

    this.userProfile = userProfile;
  }

  /**
   * @return the {@link UserDataAD} of the user currently logged in.
   */
  public static UserDataAD get() {

    return get(SecurityContextHolder.getContext().getAuthentication());
  }

  /**
   * @param authentication is the {@link Authentication} where com.devonfw.module.winauth.common.api.to
   *        retrieve the user from.
   * @return the {@link UserDataAD} of the logged in user from the given {@link Authentication}.
   */
  public static UserDataAD get(Authentication authentication) {

    if (authentication == null) {
      throw new IllegalStateException("Authentication not available!");
    }
    Object principal = authentication.getPrincipal();
    if (principal == null) {
      throw new IllegalStateException("Principal not available!");
    }
    try {
      return (UserDataAD) principal;
    } catch (ClassCastException e) {
      throw new IllegalStateException("Principal (" + principal + ") is not an instance of UserDataAD!", e);
    }
  }
}
