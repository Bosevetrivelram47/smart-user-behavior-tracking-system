package com.smarttracking.behavior.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.smarttracking.behavior.entity.NavigationLog;

public interface NavigationLogRepository extends JpaRepository<NavigationLog, Long> {
	public List<NavigationLog> findAllByUser_UserId(Long userId);

	@Query("""
				SELECT n.pageName, COUNT(n)
				FROM NavigationLog n
				GROUP BY n.pageName
				ORDER BY COUNT(n) DESC
			""")
	List<Object[]> getMostVisitedPages();
}
