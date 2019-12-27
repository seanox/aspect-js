<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html"/>
  <xsl:template match="/">
    LIST EXT:
    <xsl:for-each select="/list/entry">
      <xsl:sort select="@name" order="descending"/> 
      <xsl:value-of select="@name"/>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>